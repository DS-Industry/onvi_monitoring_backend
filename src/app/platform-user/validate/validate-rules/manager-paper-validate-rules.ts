import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import {
  MANAGER_PAPER_DELETE_EXCEPTION_CODE, MANAGER_PAPER_TYPE_UPDATE_EXCEPTION_CODE,
  MANAGER_PAPER_UPDATE_EXCEPTION_CODE, MANAGER_REPORT_PERIOD_GET_DETAIL_EXCEPTION_CODE
} from "@constant/error.constants";
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { ManagerReportPeriod } from "@manager-paper/managerReportPeriod/domain/managerReportPeriod";
import { ManagerPaperType } from "@manager-paper/managerPaperType/domain/managerPaperType";

@Injectable()
export class ManagerPaperValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async updateManagerPaperValidate(
    managerPaperId: number,
    ability: any,
  ): Promise<ManagerPaper> {
    const response = [];
    const managerPaper =
      await this.validateLib.managerPaperExists(managerPaperId);
    response.push(managerPaper);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.MANAGER_PAPER,
      MANAGER_PAPER_UPDATE_EXCEPTION_CODE,
    );

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      managerPaper.object,
    );
    return managerPaper.object;
  }

  public async updateManagerPaperTypeValidate(
    managerPaperTypeId: number,
  ): Promise<ManagerPaperType> {
    const response = [];
    const managerPaperType =
      await this.validateLib.managerPaperTypeExists(managerPaperTypeId);
    response.push(managerPaperType);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.MANAGER_PAPER,
      MANAGER_PAPER_TYPE_UPDATE_EXCEPTION_CODE,
    );

    return managerPaperType.object;
  }

  public async deleteManagerPaperValidate(
    managerPaperId: number,
    ability: any,
  ): Promise<ManagerPaper> {
    const response = [];
    const managerPaper =
      await this.validateLib.managerPaperExists(managerPaperId);
    response.push(managerPaper);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.MANAGER_PAPER,
      MANAGER_PAPER_DELETE_EXCEPTION_CODE,
    );

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.delete,
      managerPaper.object,
    );
    return managerPaper.object;
  }

  public async getDetailManagerPaperPeriodValidate(
    managerReportPeriodId: number,
  ): Promise<ManagerReportPeriod> {
    const response = [];
    const managerReportPeriod =
      await this.validateLib.managerReportPeriodExists(managerReportPeriodId);
    response.push(managerReportPeriod);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.MANAGER_PAPER,
      MANAGER_REPORT_PERIOD_GET_DETAIL_EXCEPTION_CODE,
    );

    return managerReportPeriod.object;
  }
}
