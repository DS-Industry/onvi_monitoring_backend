import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { User } from '@platform-user/user/domain/user';
import { ShiftReportUpdateDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-update.dto';
import { IShiftGradingRepository } from '@finance/shiftReport/shiftGrading/interface/shiftGrading';
import { FindMethodsShiftGradingUseCase } from '@finance/shiftReport/shiftGrading/use-cases/shiftGrading-find-methods';
import { ShiftGrading } from '@finance/shiftReport/shiftGrading/domain/shiftGrading';

@Injectable()
export class UpdateShiftReportUseCase {
  constructor(
    private readonly shiftReportRepository: IShiftReportRepository,
    private readonly shiftGradingRepository: IShiftGradingRepository,
    private readonly findMethodsShiftGradingUseCase: FindMethodsShiftGradingUseCase,
  ) {}

  async execute(
    input: ShiftReportUpdateDto,
    oldShiftReport: ShiftReport,
    user: User,
  ): Promise<ShiftReport> {
    const {
      typeWorkDay,
      timeWorkedOut,
      startWorkingTime,
      endWorkingTime,
      estimation,
      status,
      cashAtStart,
      cashAtEnd,
      comment,
      gradingData,
    } = input;

    oldShiftReport.typeWorkDay = typeWorkDay ?? oldShiftReport.typeWorkDay;
    oldShiftReport.timeWorkedOut =
      timeWorkedOut ?? oldShiftReport.timeWorkedOut;
    oldShiftReport.startWorkingTime =
      startWorkingTime ?? oldShiftReport.startWorkingTime;
    oldShiftReport.endWorkingTime =
      endWorkingTime ?? oldShiftReport.endWorkingTime;
    oldShiftReport.estimation = estimation ?? oldShiftReport.estimation;
    oldShiftReport.status = status ?? oldShiftReport.status;
    oldShiftReport.cashAtStart = cashAtStart ?? oldShiftReport.cashAtStart;
    oldShiftReport.cashAtEnd = cashAtEnd ?? oldShiftReport.cashAtEnd;
    oldShiftReport.comment = comment ?? oldShiftReport.comment;
    oldShiftReport.updatedAt = new Date();
    oldShiftReport.updatedById = user.id;

    if (gradingData) {
      const oldShiftGradings =
        await this.findMethodsShiftGradingUseCase.getAllByShiftReportId(
          oldShiftReport.id,
        );
      const gradingDataMap = new Map(
        gradingData.map((g) => [g.parameterId, g.estimationId]),
      );

      const gradingsToUpdate: ShiftGrading[] = oldShiftGradings
        .filter((oldGrading) =>
          gradingDataMap.has(oldGrading.gradingParameterId),
        )
        .map((oldGrading) => {
          oldGrading.gradingEstimationId = gradingDataMap.get(
            oldGrading.gradingParameterId,
          )!;
          return oldGrading;
        });

      if (gradingsToUpdate.length > 0) {
        await this.shiftGradingRepository.updateMany(gradingsToUpdate);
      }
    }

    return await this.shiftReportRepository.update(oldShiftReport);
  }
}
