import { Injectable } from '@nestjs/common';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { ShiftReportReceiverResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/day-shift-report-get-by-filter-response.dto';
import { User } from '@platform-user/user/domain/user';
import { StatusWorkDayShiftReport, TypeWorkDay } from '@prisma/client';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { FindMethodsGradingParameterUseCase } from '@finance/shiftReport/gradingParameter/use-cases/gradingParameter-find-methods';
import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';
import { IShiftGradingRepository } from '@finance/shiftReport/shiftGrading/interface/shiftGrading';
import { FindMethodsGradingEstimationUseCase } from '@finance/shiftReport/gradingEstimation/use-cases/gradingEstimation-find-methods';
import { FullDataShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-full-data';

@Injectable()
export class ReceiverShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly shiftReportRepository: IShiftReportRepository,
    private readonly findMethodsGradingParameterUseCase: FindMethodsGradingParameterUseCase,
    private readonly findMethodsGradingEstimationUseCase: FindMethodsGradingEstimationUseCase,
    private readonly shiftGradingRepository: IShiftGradingRepository,
    private readonly fullDataShiftReportUseCase: FullDataShiftReportUseCase,
  ) {}

  async execute(
    posId: number,
    workerId: number,
    workDate: Date,
    user: User,
    typeWorkDay: TypeWorkDay,
    startWorkingTime?: Date,
    endWorkingTime?: Date,
  ): Promise<ShiftReportReceiverResponseDto> {
    const shiftReportCheck =
      await this.findMethodsShiftReportUseCase.getOneWorkerIdAndDate(
        posId,
        workerId,
        workDate,
      );
    if (shiftReportCheck) {
      return await this.fullDataShiftReportUseCase.execute(shiftReportCheck);
    }
    const lastShiftReport =
      await this.findMethodsShiftReportUseCase.getLastByStatusSentAndPosId(
        posId,
        workDate,
      );
    const shiftReportData = new ShiftReport({
      posId: posId,
      workerId: workerId,
      workDate: workDate,
      typeWorkDay: typeWorkDay,
      startWorkingTime: startWorkingTime,
      endWorkingTime: endWorkingTime,
      status: StatusWorkDayShiftReport.SAVED,
      cashAtStart: lastShiftReport?.cashAtEnd || 0,
      createdById: user.id,
      updatedById: user.id,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    const shiftReport =
      await this.shiftReportRepository.create(shiftReportData);

    const shiftGradings: ShiftGrading[] = [];
    const gradingParameters =
      await this.findMethodsGradingParameterUseCase.getAll();
    gradingParameters.map(async (item) => {
      shiftGradings.push(
        new ShiftGrading({
          shiftReportId: shiftReport.id,
          gradingParameterId: item.id,
        }),
      );
    });
    await this.shiftGradingRepository.createMany(shiftGradings);

    const gradingEstimations =
      await this.findMethodsGradingEstimationUseCase.getAll();

    const parametersInfo = gradingParameters.map((param) => ({
      id: param.id,
      name: param.name,
      weightPercent: param.weightPercent,
    }));
    const estimationsInfo = gradingEstimations.map((est) => ({
      id: est.id,
      name: est.name,
      weightPercent: est.weightPercent,
    }));

    return {
      id: shiftReport.id,
      workerId: shiftReport.workerId,
      posId: shiftReport.posId,
      workDate: shiftReport.workDate,
      typeWorkDay: shiftReport.typeWorkDay,
      timeWorkedOut: shiftReport?.timeWorkedOut,
      startWorkingTime: shiftReport?.startWorkingTime,
      endWorkingTime: shiftReport?.endWorkingTime,
      estimation: shiftReport?.estimation,
      status: shiftReport?.status,
      cashAtStart: shiftReport?.cashAtStart,
      cashAtEnd: shiftReport?.cashAtEnd,
      comment: shiftReport?.comment,
      gradingParameterInfo: {
        parameters: parametersInfo,
        allEstimations: estimationsInfo,
      },
    };
  }
}
