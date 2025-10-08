import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { Position } from '@hr/position/domain/position';
import {
  HR_CREATE_POSITION_EXCEPTION_CODE,
  HR_CREATE_PREPAYMENT_EXCEPTION_CODE,
  HR_CREATE_PAYMENT_EXCEPTION_CODE,
  HR_CREATE_WORKER_EXCEPTION_CODE,
  HR_GET_ONE_POSITION_EXCEPTION_CODE,
  HR_GET_ONE_WORKER_EXCEPTION_CODE,
  HR_UPDATE_WORKER_EXCEPTION_CODE
} from "@constant/error.constants";
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { Worker } from '@hr/worker/domain/worker';

@Injectable()
export class HrValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createPositionValidate(
    organizationId: number,
    ability: any,
  ): Promise<any> {
    const response = [];
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_CREATE_POSITION_EXCEPTION_CODE,
    );

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
  }

  public async createWorkerValidate(
    hrPositionId: number,
    organizationId: number,
    ability: any,
  ): Promise<any> {
    const response = [];
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);
    response.push(await this.validateLib.positionByIdExists(hrPositionId));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_CREATE_WORKER_EXCEPTION_CODE,
    );
    if (organizationCheck.object) {
      ForbiddenError.from(ability).throwUnlessCan(
        PermissionAction.read,
        organizationCheck.object,
      );
    }
  }

  public async updateWorkerValidate(
    workerId: number,
    ability: any,
    hrPositionId?: number,
  ): Promise<Worker> {
    const response = [];
    const workerCheck = await this.validateLib.workerByIdExists(workerId);
    response.push(workerCheck);

    if (hrPositionId) {
      response.push(await this.validateLib.positionByIdExists(hrPositionId));
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_UPDATE_WORKER_EXCEPTION_CODE,
    );

    return workerCheck.object;
  }

  public async findOneByIdWorkerValidate(workerId: number): Promise<Worker> {
    const response = [];
    const workerCheck = await this.validateLib.workerByIdExists(workerId);
    response.push(workerCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_GET_ONE_WORKER_EXCEPTION_CODE,
    );
    return workerCheck.object;
  }

  public async findOneByIdPositionValidate(
    positionId: number,
  ): Promise<Position> {
    const response = [];
    const positionCheck = await this.validateLib.positionByIdExists(positionId);
    response.push(positionCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_GET_ONE_POSITION_EXCEPTION_CODE,
    );
    return positionCheck.object;
  }

  public async createPrepayment(
    workerId: number,
    billingMonth: Date,
  ): Promise<any> {
    const response = [];
    response.push(await this.validateLib.workerByIdExists(workerId));
    response.push(
      await this.validateLib.prepaymentForMonthAndWorker(
        workerId,
        billingMonth,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_CREATE_PREPAYMENT_EXCEPTION_CODE,
    );
  }

  public async createPayment(
    hrWorkerId: number,
    billingMonth: Date,
    paymentSum: number,
  ): Promise<any> {
    const response = [];
    response.push(await this.validateLib.workerByIdExists(hrWorkerId));
    response.push(
      await this.validateLib.paymentSumValidation(
        hrWorkerId,
        billingMonth,
        paymentSum,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.HR,
      HR_CREATE_PAYMENT_EXCEPTION_CODE,
    );
  }
}
