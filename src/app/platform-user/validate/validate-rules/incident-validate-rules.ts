import { Injectable } from '@nestjs/common';
import {
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { IncidentCreateDto } from '@platform-user/validate/validate-rules/dto/incident-create.dto';
import { IncidentUpdateDto } from '@platform-user/validate/validate-rules/dto/incident-update.dto';
import { Incident } from '@equipment/incident/incident/domain/incident';

@Injectable()
export class IncidentValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(input: IncidentCreateDto) {
    const response: ValidateResponse[] = [];
    const posCheck = await this.validateLib.posByIdExists(input.posId);
    response.push(posCheck);
    response.push(await this.validateLib.userByIdExists(input.workerId));
    if (input.equipmentKnotId) {
      response.push(
        await this.validateLib.equipmentKnotByIdExists(
          input.equipmentKnotId,
          input.posId,
        ),
      );
    }
    if (input.incidentNameId) {
      response.push(
        await this.validateLib.incidentNameByIdExists(input.incidentNameId),
      );
    }
    if (input.incidentReasonId) {
      response.push(
        await this.validateLib.incidentInfoByIdExists(input.incidentReasonId),
      );
    }
    if (input.incidentSolutionId) {
      response.push(
        await this.validateLib.incidentInfoByIdExists(input.incidentSolutionId),
      );
    }
    if (input.carWashDeviceProgramsTypeId) {
      response.push(
        await this.validateLib.deviceProgramTypeByIdExists(
          input.carWashDeviceProgramsTypeId,
        ),
      );
    }

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(input.ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
  }

  public async updateValidate(input: IncidentUpdateDto): Promise<Incident> {
    const response: ValidateResponse[] = [];
    const incidentCheck = await this.validateLib.incidentByIdExists(
      input.incidentId,
    );
    response.push(incidentCheck);
    if (input.workerId) {
      response.push(await this.validateLib.userByIdExists(input.workerId));
    }
    if (input.equipmentKnotId && incidentCheck.object) {
      response.push(
        await this.validateLib.equipmentKnotByIdExists(
          input.equipmentKnotId,
          incidentCheck.object.posId,
        ),
      );
    }
    if (input.incidentNameId) {
      response.push(
        await this.validateLib.incidentNameByIdExists(input.incidentNameId),
      );
    }
    if (input.incidentReasonId) {
      response.push(
        await this.validateLib.incidentInfoByIdExists(input.incidentReasonId),
      );
    }
    if (input.incidentSolutionId) {
      response.push(
        await this.validateLib.incidentInfoByIdExists(input.incidentSolutionId),
      );
    }
    if (input.carWashDeviceProgramsTypeId) {
      response.push(
        await this.validateLib.deviceProgramTypeByIdExists(
          input.carWashDeviceProgramsTypeId,
        ),
      );
    }

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(input.ability).throwUnlessCan(
      PermissionAction.update,
      incidentCheck.object,
    );
    return incidentCheck.object;
  }

  public async getAllIncidentByFilterValidate(posId: number, ability: any) {
    const posCheck = await this.validateLib.posByIdExists(posId);

    if (posCheck.code !== 200) {
      throw new Error(`Validation errors: ${posCheck.code}`);
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
  }
}
