import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { REPORT_GET_ONE_EXCEPTION_CODE } from '@constant/error.constants';
import { ReportApplyDto } from '@platform-user/validate/validate-rules/dto/report-apply.dto';
import { ReportTemplate } from '@report/report/domain/reportTemplate';

@Injectable()
export class ReportValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async getOneByIdValidate(reportId: number): Promise<ReportTemplate> {
    const response = [];
    const reportCheck = await this.validateLib.reportByIdExists(reportId);
    response.push(reportCheck);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.REPORT_TEMPLATE,
      REPORT_GET_ONE_EXCEPTION_CODE,
    );
    return reportCheck.object;
  }

  public async applyValidate(
    reportId: number,
    data: any,
  ): Promise<ReportApplyDto> {
    const response = [];
    let paramsData: ValidateResponse<any[]>;
    const reportCheck = await this.validateLib.reportByIdExists(reportId);
    response.push(reportCheck);
    if (reportCheck.object) {
      paramsData = await this.validateLib.paramsValidate(
        reportCheck.object.params,
        data,
      );
      response.push(paramsData);
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.REPORT_TEMPLATE,
      REPORT_GET_ONE_EXCEPTION_CODE,
    );
    return { report: reportCheck.object, paramsArray: paramsData.object };
  }
}
