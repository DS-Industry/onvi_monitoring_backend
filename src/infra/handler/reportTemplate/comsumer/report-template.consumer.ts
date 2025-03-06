import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { HandlerReportUseCase } from '@report/report/use-cases/report-handler';
import { Job } from 'bullmq';

@Processor('reportTemplate')
@Injectable()
export class ReportTemplateConsumer extends WorkerHost {
  constructor(private readonly handlerReportUseCase: HandlerReportUseCase) {
    super();
  }

  async process(job: Job, token: string | undefined): Promise<any> {
    await this.handlerReportUseCase.execute(
      job.data.report.props,
      job.data.paramsArray,
      job.data.transaction.props,
    );
    return Promise.resolve(undefined);
  }
}
