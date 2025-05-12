import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/interface/workDayShiftReportCashOper';
import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';
import { WorkDayShiftReportCashOperCreateDto } from '@finance/shiftReport/workDayShiftReportCashOper/use-cases/dto/workDayShiftReportCashOper-create.dto';
import { UpdateWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-update';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CreateWorkDayShiftReportCashOperUseCase {
  constructor(
    private readonly workDayShiftReportCashOperRepository: IWorkDayShiftReportCashOperRepository,
    private readonly updateWorkDayShiftReportUseCase: UpdateWorkDayShiftReportUseCase,
  ) {}

  async execute(
    data: WorkDayShiftReportCashOperCreateDto,
    workDayShiftReport: WorkDayShiftReport,
    user: User,
  ): Promise<WorkDayShiftReportCashOper> {
    const workDayShiftReportCashOperData = new WorkDayShiftReportCashOper({
      workDayShiftReportId: workDayShiftReport.id,
      sum: data.sum,
      type: data.type,
      carWashDeviceId: data?.carWashDeviceId,
      eventDate: data?.eventData,
      comment: data?.comment,
    });
    const workDayShiftReportCashOper =
      await this.workDayShiftReportCashOperRepository.create(
        workDayShiftReportCashOperData,
      );
    await this.updateWorkDayShiftReportUseCase.execute(
      {},
      workDayShiftReport,
      user,
    );
    return workDayShiftReportCashOper;
  }
}
