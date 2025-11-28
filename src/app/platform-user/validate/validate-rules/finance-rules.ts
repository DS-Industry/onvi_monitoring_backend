import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import {
  FINANCE_CREATE_EXCEPTION_CODE,
  FINANCE_GET_ONE_EXCEPTION_CODE,
  FINANCE_RECALCULATE_EXCEPTION_CODE,
  FINANCE_RETURN_EXCEPTION_CODE,
} from '@constant/error.constants';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction, StatusWorkDayShiftReport } from '@prisma/client';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';

@Injectable()
export class FinanceValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createCashCollectionValidate(
    posId: number,
    cashCollectionDate: Date,
    ability: any,
  ): Promise<CashCollection> {
    const response = [];
    const posCheck = await this.validateLib.posByIdExists(posId);
    response.push(posCheck);
    const oldCashCollectionCheck =
      await this.validateLib.oldCashCollectionByPosId(
        posId,
        cashCollectionDate,
      );
    response.push(oldCashCollectionCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_CREATE_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
    if (oldCashCollectionCheck.object) {
      return oldCashCollectionCheck.object;
    }
  }

  public async getCashCollectionValidate(
    cashCollectionId: number,
    ability: any,
  ): Promise<CashCollection> {
    const response = [];
    const cashCollectionCheck =
      await this.validateLib.cashCollectionByIdExists(cashCollectionId);
    response.push(cashCollectionCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_GET_ONE_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      cashCollectionCheck.object,
    );
    return cashCollectionCheck.object;
  }

  public async recalculateCashCollectionValidate(
    cashCollectionId: number,
    cashCollectionDeviceIds: number[],
    cashCollectionDeviceTypeIds: number[],
    ability: any,
  ): Promise<CashCollection> {
    const response = [];
    const cashCollectionCheck =
      await this.validateLib.cashCollectionByIdExists(cashCollectionId);
    response.push(cashCollectionCheck);
    response.push(
      await this.validateLib.cashCollectionRecalculateStatus(
        cashCollectionCheck.object,
      ),
    );
    response.push(
      await this.validateLib.cashCollectionDeviceComparisonByIdAndList(
        cashCollectionId,
        cashCollectionDeviceIds,
      ),
    );
    response.push(
      await this.validateLib.cashCollectionDeviceTypeComparisonByIdAndList(
        cashCollectionId,
        cashCollectionDeviceTypeIds,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RECALCULATE_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      cashCollectionCheck.object,
    );
    return cashCollectionCheck.object;
  }

  public async returnCashCollectionValidate(
    cashCollectionId: number,
    ability: any,
  ): Promise<CashCollection> {
    const response = [];
    const cashCollectionCheck =
      await this.validateLib.cashCollectionByIdExists(cashCollectionId);
    response.push(cashCollectionCheck);
    response.push(
      await this.validateLib.cashCollectionReturnStatus(
        cashCollectionCheck.object,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      cashCollectionCheck.object,
    );
    return cashCollectionCheck.object;
  }

  public async deleteCashCollectionValidate(
    cashCollectionId: number,
    ability: any,
  ): Promise<CashCollection> {
    const response = [];
    const cashCollectionCheck =
      await this.validateLib.cashCollectionByIdExists(cashCollectionId);
    response.push(cashCollectionCheck);
    response.push(
      await this.validateLib.cashCollectionDeleteStatus(
        cashCollectionCheck.object,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.create,
      cashCollectionCheck.object,
    );
    return cashCollectionCheck.object;
  }

  public async receiverShiftReport(
    posId: number,
    workerId: number,
    ability: any,
  ): Promise<void> {
    const response = [];
    const posCheck = await this.validateLib.posByIdExists(posId);
    response.push(posCheck);
    response.push(await this.validateLib.workerByIdExists(workerId));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
  }

  public async getOneByIdShiftReport(
    shiftReportId: number,
    ability: any,
  ): Promise<ShiftReport> {
    const response = [];
    const shiftReport =
      await this.validateLib.shiftReportByIdExists(shiftReportId);
    response.push(shiftReport);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      shiftReport.object,
    );
    return shiftReport.object;
  }

  public async deleteShiftReportValidate(
    shiftReportId: number,
    ability: any,
  ): Promise<ShiftReport> {
    const response = [];
    const shiftReportCheck =
      await this.validateLib.shiftReportByIdExists(shiftReportId);
    response.push(shiftReportCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.delete,
      shiftReportCheck.object,
    );
    return shiftReportCheck.object;
  }

  public async updateShiftReportById(
    shiftReportId: number,
    ability: any,
  ): Promise<ShiftReport> {
    const response = [];
    const shiftReportCheck =
      await this.validateLib.shiftReportByIdExists(shiftReportId);
    if (
      shiftReportCheck.object &&
      shiftReportCheck.object.status == StatusWorkDayShiftReport.SENT
    ) {
      response.push({
        code: 400,
        errorMessage: 'The shift report already sent',
      });
    }
    response.push(shiftReportCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.create,
      shiftReportCheck.object,
    );
    return shiftReportCheck.object;
  }
  public async returnDayReportById(
    shiftReportId: number,
    ability: any,
  ): Promise<ShiftReport> {
    const response = [];
    const shiftReportCheck =
      await this.validateLib.shiftReportByIdExists(shiftReportId);
    if (
      shiftReportCheck.object &&
      shiftReportCheck.object.status != StatusWorkDayShiftReport.SENT
    ) {
      response.push({
        code: 400,
        errorMessage: 'The shift report not sent',
      });
    }
    response.push(shiftReportCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      shiftReportCheck.object,
    );
    return shiftReportCheck.object;
  }
}
