import { Injectable } from '@nestjs/common';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class CalculateDailyPayoutShiftReportUseCase {
  constructor(
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly prisma: PrismaService,
  ) {}

  async execute(shiftReportId: number, workerId: number): Promise<number> {
    const worker = await this.findMethodsWorkerUseCase.getById(workerId);

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

    const dailyShiftPayout =
      worker.dailySalary + (worker.bonusPayout * totalPercentage) / 100;

    return Math.round(dailyShiftPayout);
  }
}
