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
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';

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

  public async addWorkerShiftReport(
    shiftReportId: number,
    userId: number,
    ability: any,
  ): Promise<void> {
    const response = [];
    const shiftReport =
      await this.validateLib.shiftReportByIdExists(shiftReportId);
    response.push(shiftReport);
    response.push(await this.validateLib.userByIdExists(userId));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      shiftReport.object,
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

  public async getDayReportById(
    dayReportId: number,
    ability: any,
  ): Promise<WorkDayShiftReport> {
    const response = [];
    const workDayShiftReport =
      await this.validateLib.workDayShiftReportByIdExists(dayReportId);
    response.push(workDayShiftReport);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    const shiftReport = await this.validateLib.shiftReportByIdExists(
      workDayShiftReport.object.shiftReportId,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      shiftReport.object,
    );
    return workDayShiftReport.object;
  }

  public async updateDayReportById(
    dayReportId: number,
    ability: any,
  ): Promise<WorkDayShiftReport> {
    const response = [];
    const workDayShiftReport =
      await this.validateLib.workDayShiftReportByIdExists(dayReportId);
    response.push(workDayShiftReport);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    const shiftReport = await this.validateLib.shiftReportByIdExists(
      workDayShiftReport.object.shiftReportId,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      shiftReport.object,
    );
    return workDayShiftReport.object;
  }

  public async sendDayReportById(
    dayReportId: number,
    ability: any,
  ): Promise<WorkDayShiftReport> {
    const response = [];
    const workDayShiftReport =
      await this.validateLib.workDayShiftReportByIdExists(dayReportId);
    response.push(workDayShiftReport);
    if (
      workDayShiftReport.object &&
      workDayShiftReport.object.status == StatusWorkDayShiftReport.SENT
    ) {
      response.push({
        code: 400,
        errorMessage: 'The work day shift report can not send',
      });
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    const shiftReport = await this.validateLib.shiftReportByIdExists(
      workDayShiftReport.object.shiftReportId,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      shiftReport.object,
    );
    return workDayShiftReport.object;
  }

  public async createCashOper(
    dayReportId: number,
    ability: any,
  ): Promise<WorkDayShiftReport> {
    const response = [];
    const workDayShiftReport =
      await this.validateLib.workDayShiftReportByIdExists(dayReportId);
    response.push(workDayShiftReport);
    if (
      workDayShiftReport.object &&
      workDayShiftReport.object.status == StatusWorkDayShiftReport.SENT
    ) {
      response.push({
        code: 400,
        errorMessage: 'You can not change the report',
      });
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    const shiftReport = await this.validateLib.shiftReportByIdExists(
      workDayShiftReport.object.shiftReportId,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      shiftReport.object,
    );
    return workDayShiftReport.object;
  }

  public async getClean(
    dayReportId: number,
    ability: any,
  ): Promise<{ workDay: WorkDayShiftReport; posId: number }> {
    const response = [];
    const workDayShiftReport =
      await this.validateLib.workDayShiftReportByIdExists(dayReportId);
    response.push(workDayShiftReport);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.FINANCE,
      FINANCE_RETURN_EXCEPTION_CODE,
    );
    const shiftReport = await this.validateLib.shiftReportByIdExists(
      workDayShiftReport.object.shiftReportId,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      shiftReport.object,
    );
    return {
      workDay: workDayShiftReport.object,
      posId: shiftReport.object.posId,
    };
  }
}
