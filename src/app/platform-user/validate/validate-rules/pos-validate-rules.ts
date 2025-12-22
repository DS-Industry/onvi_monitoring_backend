import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import {
  POS_CONNECTION_PROGRAM_EXCEPTION_CODE,
  POS_CONNECTION_WORKER_EXCEPTION_CODE,
  POS_CREATE_EXCEPTION_CODE,
  POS_GET_BY_ID_EXCEPTION_CODE,
  POS_PATCH_PROGRAM_RATE_EXCEPTION_CODE,
} from '@constant/error.constants';
import { PosException } from '@exception/option.exceptions';

@Injectable()
export class PosValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(
    name: string,
    organizationId: number,
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    response.push(await this.validateLib.posByNameNotExists(name));
    response.push(
      await this.validateLib.organizationByIdExists(organizationId),
    );

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.POS,
      POS_CREATE_EXCEPTION_CODE,
    );
    const organization = response.find(
      (item) => item.object !== undefined,
    )?.object;
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organization,
    );
  }

  public async getOneByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.posByIdExists(id);

    if (response.code !== 200) {
      throw new PosException(
        POS_GET_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      response.object,
    );
    return response.object;
  }

  public async connectionProgramTypesValidate(
    id: number,
    programTypeIds: number[],
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    const pos = await this.validateLib.posByIdExists(id);
    response.push(pos);
    response.push(
      await this.validateLib.programTypeByIdsExists(programTypeIds),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.POS,
      POS_CONNECTION_PROGRAM_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      pos.object,
    );
  }

  public async patchProgramRateValidate(
    id: number,
    programTypeIds: number[],
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    const pos = await this.validateLib.posByIdExists(id);
    response.push(pos);
    response.push(
      await this.validateLib.programTypeByIdsAndPosExists(programTypeIds, id),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.POS,
      POS_PATCH_PROGRAM_RATE_EXCEPTION_CODE,
    );
  }

  public async updateConnectedWorkerPos(workerIds: number[], posId: number) {
    const response: ValidateResponse[] = [];
    response.push(await this.validateLib.posByIdExists(posId));
    workerIds.map(async (workerId) =>
      response.push(await this.validateLib.workerByIdExists(workerId)),
    );

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      POS_CONNECTION_WORKER_EXCEPTION_CODE,
    );
  }
}
