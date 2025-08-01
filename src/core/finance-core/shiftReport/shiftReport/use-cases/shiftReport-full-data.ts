import { Injectable } from '@nestjs/common';
import { FindMethodsGradingParameterUseCase } from '@finance/shiftReport/gradingParameter/use-cases/gradingParameter-find-methods';
import { FindMethodsGradingEstimationUseCase } from '@finance/shiftReport/gradingEstimation/use-cases/gradingEstimation-find-methods';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import {
  GradingParameterInfo,
  ShiftReportReceiverResponseDto,
} from '@finance/shiftReport/shiftReport/use-cases/dto/day-shift-report-get-by-filter-response.dto';
import { FindMethodsShiftGradingUseCase } from '@finance/shiftReport/shiftGrading/use-cases/shiftGrading-find-methods';

@Injectable()
export class FullDataShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftGradingUseCase: FindMethodsShiftGradingUseCase,
    private readonly findMethodsGradingParameterUseCase: FindMethodsGradingParameterUseCase,
    private readonly findMethodsGradingEstimationUseCase: FindMethodsGradingEstimationUseCase,
  ) {}

  async execute(
    shiftReport: ShiftReport,
  ): Promise<ShiftReportReceiverResponseDto> {
    const shiftGradings =
      await this.findMethodsShiftGradingUseCase.getAllByShiftReportId(
        shiftReport.id,
      );
    const allGradingParameters =
      await this.findMethodsGradingParameterUseCase.getAll();
    const allGradingEstimations =
      await this.findMethodsGradingEstimationUseCase.getAll();

    const parametersInfo: GradingParameterInfo[] = allGradingParameters.map(
      (param) => {
        const shiftGrading = shiftGradings.find(
          (sg) => sg.gradingParameterId === param.id,
        );
        return {
          id: param.id,
          name: param.name,
          estimationId: shiftGrading?.gradingEstimationId,
        };
      },
    );

    return {
      id: shiftReport.id,
      workerId: shiftReport.workerId,
      posId: shiftReport.posId,
      workDate: shiftReport.workDate,
      typeWorkDay: shiftReport.typeWorkDay,
      timeWorkedOut: shiftReport.timeWorkedOut,
      startWorkingTime: shiftReport.startWorkingTime,
      endWorkingTime: shiftReport.endWorkingTime,
      estimation: shiftReport.estimation,
      status: shiftReport.status,
      cashAtStart: shiftReport.cashAtStart,
      cashAtEnd: shiftReport.cashAtEnd,
      comment: shiftReport.comment,
      gradingParameterInfo: {
        parameters: parametersInfo,
        allEstimations: allGradingEstimations.map((est) => ({
          id: est.id,
          name: est.name,
        })),
      },
    };
  }
}
