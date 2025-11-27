import { Injectable } from '@nestjs/common';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class CalculateDailyPayoutShiftReportUseCase {
  constructor(
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly prisma: PrismaService,
  ) {}

  private isNightShift(
    startWorkingTime?: Date,
  ): boolean {
    if (!startWorkingTime) {
      return false;
    }

    const startHour = startWorkingTime.getUTCHours();

    return startHour < 8 || startHour >= 20;
  }

  async execute(shiftReportId: number, workerId: number): Promise<number> {
    const shiftReport =
      await this.findMethodsShiftReportUseCase.getOneById(shiftReportId);
    if (!shiftReport) {
      throw new Error(`Shift report with id ${shiftReportId} not found`);
    }

    const worker = await this.findMethodsWorkerUseCase.getById(workerId);
    if (!worker) {
      throw new Error(`Worker with id ${workerId} not found`);
    }

    const isNight = this.isNightShift(
      shiftReport.startWorkingTime,
    );

    const shiftGradings = await this.prisma.mNGShiftGrading.findMany({
      where: {
        shiftReportId,
      },
      include: {
        gradingParameter: true,
        gradingEstimation: true,
      },
    });

    const totalPercentage = shiftGradings.reduce((sum, grading) => {
      const parameterWeightPercent =
        grading.gradingParameter?.weightPercent || 0;
      const estimationWeightPercent =
        grading.gradingEstimation?.weightPercent || 0;
      const parameterPercent =
        (parameterWeightPercent * estimationWeightPercent) / 100;
      return sum + parameterPercent;
    }, 0);

    let baseRate: number | null = null;
    let bonusRate: number | null = null;

    if (shiftReport.posId && worker.hrPositionId) {
      const positionSalaryRate =
        await this.prisma.posPositionSalaryRate.findFirst({
          where: {
            posId: shiftReport.posId,
            hrPositionId: worker.hrPositionId,
          },
        });

      if (positionSalaryRate) {
        baseRate = isNight
          ? positionSalaryRate.baseRateNight
          : positionSalaryRate.baseRateDay;
        bonusRate = isNight
          ? positionSalaryRate.bonusRateNight
          : positionSalaryRate.bonusRateDay;
      }
    }

    const finalBaseRate = baseRate ?? worker.dailySalary;
    const finalBonusRate = bonusRate ?? worker.bonusPayout ?? 0;

    const dailyShiftPayout =
      finalBaseRate + (finalBonusRate * totalPercentage) / 100;

    return Math.round(dailyShiftPayout);
  }
}
