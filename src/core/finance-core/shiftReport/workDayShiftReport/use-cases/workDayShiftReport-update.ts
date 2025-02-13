import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { User } from '@platform-user/user/domain/user';
import { WorkDayShiftReportUpdateDto } from '@finance/shiftReport/workDayShiftReport/use-cases/dto/workDayShiftReport-update.dto';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';

@Injectable()
export class UpdateWorkDayShiftReportUseCase {
  constructor(
    private readonly workDayShiftReportRepository: IWorkDayShiftReportRepository,
    private readonly updateShiftReportUseCase: UpdateShiftReportUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
  ) {}

  async execute(
    input: WorkDayShiftReportUpdateDto,
    oldWorkDayShiftReport: WorkDayShiftReport,
    user: User,
  ): Promise<WorkDayShiftReport> {
    const {
      typeWorkDay,
      timeWorkedOut,
      startWorkingTime,
      endWorkingTime,
      estimation,
      prize,
      fine,
      comment,
    } = input;

    oldWorkDayShiftReport.typeWorkDay = typeWorkDay
      ? typeWorkDay
      : oldWorkDayShiftReport.typeWorkDay;
    oldWorkDayShiftReport.timeWorkedOut = timeWorkedOut
      ? timeWorkedOut
      : oldWorkDayShiftReport.timeWorkedOut;
    oldWorkDayShiftReport.startWorkingTime = startWorkingTime
      ? startWorkingTime
      : oldWorkDayShiftReport.startWorkingTime;
    oldWorkDayShiftReport.endWorkingTime = endWorkingTime
      ? endWorkingTime
      : oldWorkDayShiftReport.endWorkingTime;
    oldWorkDayShiftReport.estimation = estimation
      ? estimation
      : oldWorkDayShiftReport.estimation;
    oldWorkDayShiftReport.prize = prize ? prize : oldWorkDayShiftReport.prize;
    oldWorkDayShiftReport.fine = fine ? fine : oldWorkDayShiftReport.fine;
    oldWorkDayShiftReport.comment = comment
      ? comment
      : oldWorkDayShiftReport.comment;

    oldWorkDayShiftReport.updatedAt = new Date(Date.now());
    oldWorkDayShiftReport.updatedById = user.id;

    const workDay = await this.workDayShiftReportRepository.update(
      oldWorkDayShiftReport,
    );
    const shiftReport = await this.findMethodsShiftReportUseCase.getOneById(
      workDay.id,
    );
    await this.updateShiftReportUseCase.execute({}, shiftReport, user);
    return workDay;
  }
}
