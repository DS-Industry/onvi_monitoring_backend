import { Injectable } from '@nestjs/common';
import { IReportTemplateRepository } from '@report/report/interface/reportTemplate';
import * as XLSX from 'xlsx';
import { IFileAdapter } from '@libs/file/adapter';
import { UpdateTransactionUseCase } from '@report/transaction/use-cases/transaction-update';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';
import { StatusReportTemplate } from '@prisma/client';
import { ReportTemplate } from '@report/report/domain/reportTemplate';
import moment from 'moment/moment';
import slugify from 'slugify';

@Injectable()
export class HandlerReportUseCase {
  constructor(
    private readonly reportTemplateRepository: IReportTemplateRepository,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    report: ReportTemplate,
    paramsArray: any[],
    transaction: ReportTemplateTransaction,
  ): Promise<any> {
    const reportData = await this.reportTemplateRepository.apply(
      paramsArray,
      report.query,
    );

    const reportKey = `${slugify(report.name, '_')}_${moment().format('YYMMDDHHmmss')}`;
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportKey);
    const excelArrayBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelBuffer = Buffer.from(excelArrayBuffer);
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: `${reportKey}.xlsx`,
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: excelBuffer,
      size: excelBuffer.length,
      destination: '',
      filename: '',
      path: '',
      stream: null as any,
    };

    await this.fileService.upload(
      file,
      `report/${transaction.userId}/${reportKey}`,
    );
    await this.updateTransactionUseCase.execute(
      {
        reportKey: reportKey,
        status: StatusReportTemplate.DONE,
      },
      transaction,
    );
  }
}
