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
import { PermissionAction } from '@prisma/client';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

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
}
