import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApplyReportUseCase } from '@report/report/use-cases/report-apply';
import { CustomHttpException } from '@exception/custom-http.exception';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { ReportValidateRules } from '@platform-user/validate/validate-rules/report-validate-rules';
import { ReportTemplateException } from '@exception/option.exceptions';
import { ReportAllFilterDto } from '@platform-user/core-controller/dto/receive/report-all-filter.dto';
import { FindMethodsReportUseCase } from '@report/report/use-cases/report-find-methods';
import { FindMethodsTransactionUseCase } from '@report/transaction/use-cases/transaction-find-methods';
import { ReportResponseDto } from '@platform-user/core-controller/dto/response/report-response.dto';
import { ReportTransactionResponseDto } from '@platform-user/core-controller/dto/response/report-transaction-response.dto';

@Controller('report')
export class ReportController {
  constructor(
    private readonly applyReportUseCase: ApplyReportUseCase,
    private readonly findMethodsReportUseCase: FindMethodsReportUseCase,
    private readonly findMethodsTransactionUseCase: FindMethodsTransactionUseCase,
    private readonly reportValidateRules: ReportValidateRules,
  ) {}
  //Apply report
  @Post('apply/:reportId')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async applyReport(
    @Body() data: any,
    @Param('reportId', ParseIntPipe) reportId: number,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      const reportData = await this.reportValidateRules.applyValidate(
        reportId,
        data,
      );
      return await this.applyReportUseCase.execute(reportData, user);
    } catch (e) {
      if (e instanceof ReportTemplateException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get report all
  @Get('all')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAll(
    @Query() params: ReportAllFilterDto,
  ): Promise<{ reports: ReportResponseDto[]; count: number }> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      if (params.category) {
        const count = await this.findMethodsReportUseCase.getCountAllByCategory(
          params.category,
        );
        const reports = await this.findMethodsReportUseCase.getAllByCategory(
          params.category,
          skip,
          take,
        );
        const reportResponse: ReportResponseDto[] = reports.map((report) => ({
          id: report.id,
          name: report.name,
          category: report.category,
          description: report?.description,
          params: report.params,
        }));
        return {
          reports: reportResponse,
          count: count,
        };
      } else {
        const count = await this.findMethodsReportUseCase.getCountAll();
        const reports = await this.findMethodsReportUseCase.getAll(skip, take);
        const reportResponse: ReportResponseDto[] = reports.map((report) => ({
          id: report.id,
          name: report.name,
          category: report.category,
          description: report?.description,
          params: report.params,
        }));
        return {
          reports: reportResponse,
          count: count,
        };
      }
    } catch (e) {
      if (e instanceof ReportTemplateException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get transaction by user
  @Get('transaction')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getTransactionByUser(
    @Query() params: ReportAllFilterDto,
    @Request() req: any,
  ): Promise<{ transactions: ReportTransactionResponseDto[]; count: number }> {
    try {
      const { user } = req;

      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      const count =
        await this.findMethodsTransactionUseCase.getCountAllByUserId(user.id);
      const transactions =
        await this.findMethodsTransactionUseCase.getAllByUserId(
          user.id,
          skip,
          take,
        );
      const transactionResponse: ReportTransactionResponseDto[] =
        transactions.map((transaction) => ({
          id: transaction.id,
          reportTemplateId: transaction.reportTemplateId,
          userId: transaction.userId,
          startTemplateAt: transaction.startTemplateAt,
          endTemplateAt: transaction.endTemplateAt,
          status: transaction.status,
          reportKey: transaction.reportKey,
        }));
      return { transactions: transactionResponse, count: count };
    } catch (e) {
      if (e instanceof ReportTemplateException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get report by id
  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReportResponseDto> {
    try {
      const report = await this.reportValidateRules.getOneByIdValidate(id);
      return {
        id: report.id,
        name: report.name,
        category: report.category,
        description: report?.description,
        params: report.params,
      };
    } catch (e) {
      if (e instanceof ReportTemplateException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
