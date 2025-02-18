import { Injectable } from '@nestjs/common';
import { FindMethodsWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-find-methods';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';
import { WorkDayShiftReportGetByFilterDto } from '@finance/shiftReport/workDayShiftReport/use-cases/dto/workDayShiftReport-get-by-filter.dto';
import { User } from '@platform-user/user/domain/user';
import { DayShiftReportGetByFilterResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-get-by-filter-response.dto';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { StatusWorkDayShiftReport, TypeWorkDay } from '@prisma/client';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';

@Injectable()
export class GetByFilterWorkDayShiftReportUseCase {
  constructor(
    private readonly findMethodsWorkDayShiftReportUseCase: FindMethodsWorkDayShiftReportUseCase,
    private readonly workDayShiftReportRepository: IWorkDayShiftReportRepository,
    private readonly updateShiftReportUseCase: UpdateShiftReportUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
  ) {}

  async execute(
    data: WorkDayShiftReportGetByFilterDto,
    user: User,
  ): Promise<DayShiftReportGetByFilterResponseDto> {
    const workDayShiftReportCheck =
      await this.findMethodsWorkDayShiftReportUseCase.getOneByFilter(
        data.shiftReportId,
        data.userId,
        data.workDate,
      );
    if (workDayShiftReportCheck) {
      return {
        id: workDayShiftReportCheck.id,
        workerId: workDayShiftReportCheck.workerId,
        workDate: workDayShiftReportCheck.workDate,
        typeWorkDay: workDayShiftReportCheck.typeWorkDay,
        timeWorkedOut: workDayShiftReportCheck?.timeWorkedOut,
        startWorkingTime: workDayShiftReportCheck?.startWorkingTime,
        endWorkingTime: workDayShiftReportCheck?.endWorkingTime,
        estimation: workDayShiftReportCheck?.estimation,
        status: workDayShiftReportCheck?.status,
        cashAtStart: workDayShiftReportCheck?.cashAtStart,
        cashAtEnd: workDayShiftReportCheck?.cashAtEnd,
        prize: workDayShiftReportCheck?.prize,
        fine: workDayShiftReportCheck?.fine,
        comment: workDayShiftReportCheck?.comment,
      };
    }
    const shiftReport = await this.findMethodsShiftReportUseCase.getOneById(
      data.shiftReportId,
    );
    const oldWorkDayShift =
      await this.findMethodsWorkDayShiftReportUseCase.getLastByStatusSentAndPosId(
        shiftReport.posId,
      );
    const workDayShiftReportData = new WorkDayShiftReport({
      shiftReportId: data.shiftReportId,
      workerId: data.userId,
      workDate: data.workDate,
      typeWorkDay: TypeWorkDay.WEEKEND,
      status: StatusWorkDayShiftReport.SAVED,
      cashAtStart: oldWorkDayShift?.cashAtEnd || 0,
      createdById: user.id,
      updatedById: user.id,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    const workDayShiftReport = await this.workDayShiftReportRepository.create(
      workDayShiftReportData,
    );
    await this.updateShiftReportUseCase.execute({}, shiftReport, user);
    return {
      id: workDayShiftReport.id,
      workerId: workDayShiftReport.workerId,
      workDate: workDayShiftReport.workDate,
      typeWorkDay: workDayShiftReport.typeWorkDay,
      timeWorkedOut: workDayShiftReport?.timeWorkedOut,
      startWorkingTime: workDayShiftReport?.startWorkingTime,
      endWorkingTime: workDayShiftReport?.endWorkingTime,
      estimation: workDayShiftReport?.estimation,
      status: workDayShiftReport?.status,
      cashAtStart: workDayShiftReport?.cashAtStart,
      cashAtEnd: workDayShiftReport?.cashAtEnd,
      prize: workDayShiftReport?.prize,
      fine: workDayShiftReport?.fine,
      comment: workDayShiftReport?.comment,
    };
  }
}
