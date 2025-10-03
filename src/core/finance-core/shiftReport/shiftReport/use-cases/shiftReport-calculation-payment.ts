import { Injectable } from '@nestjs/common';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { ShiftReportCalculationPaymentResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/shiftReport-calculation-payment-response.dto';
import { Worker } from '@hr/worker/domain/worker';

@Injectable()
export class CalculationPaymentShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
  ) {}

  async execute(
    billingMonth: Date,
    workers: Worker[],
  ): Promise<ShiftReportCalculationPaymentResponseDto[]> {
    const dateStart = new Date(
      billingMonth.getUTCFullYear(),
      billingMonth.getUTCMonth(),
      1,
      0,
      0,
      0,
    );
    const dateEnd = new Date(
      Date.UTC(
        billingMonth.getUTCFullYear(),
        billingMonth.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
      ),
    );
    const workerIds = workers.map((worker) => worker.id);

    const calculationData =
      await this.findMethodsShiftReportUseCase.getDataForCalculation(
        dateStart,
        dateEnd,
        workerIds,
      );

    const workersMap = new Map<number, Worker>();
    workers.forEach((worker) => {
      workersMap.set(worker.id, worker);
    });

    const groupedData = calculationData.reduce((acc, data) => {
      if (!acc.has(data.workerId)) {
        acc.set(data.workerId, []);
      }
      acc.get(data.workerId)!.push(data);
      return acc;
    }, new Map<number, typeof calculationData>());

    const result: ShiftReportCalculationPaymentResponseDto[] = [];
    groupedData.forEach((shiftReports, workerId) => {
      const worker = workersMap.get(workerId);
      if (!worker) return;

      let totalSum = 0;

      shiftReports.forEach((shiftReport) => {
        const totalPercentage = shiftReport.gradingData.reduce((sum, grade) => {
          const parameterPercent =
            (grade.parameterWeightPercent * grade.estimationWeightPercent) /
            100;
          return sum + parameterPercent;
        }, 0);

        const shiftSum =
          worker.dailySalary +
          (worker.bonusPayout * totalPercentage) / 100;
        totalSum += shiftSum;
      });

      result.push({
        hrWorkerId: workerId,
        name: worker.name,
        hrPositionId: worker.hrPositionId,
        billingMonth: billingMonth,
        dailySalary: worker.dailySalary,
        maxBonusSalary: worker.bonusPayout,
        countShifts: shiftReports.length,
        sum: totalSum,
      });
    });

    return result;
  }
}
