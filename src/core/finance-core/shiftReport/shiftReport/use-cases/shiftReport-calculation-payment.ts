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

    const shiftReports =
      await this.findMethodsShiftReportUseCase.getShiftReportsWithPayout(
        dateStart,
        dateEnd,
        workerIds,
      );

    const workersMap = new Map<number, Worker>();
    workers.forEach((worker) => {
      workersMap.set(worker.id, worker);
    });

    const groupedData = shiftReports.reduce((acc, shiftReport) => {
      if (!acc.has(shiftReport.workerId)) {
        acc.set(shiftReport.workerId, []);
      }
      acc.get(shiftReport.workerId)!.push(shiftReport);
      return acc;
    }, new Map<number, typeof shiftReports>());

    const result: ShiftReportCalculationPaymentResponseDto[] = [];
    groupedData.forEach((workerShiftReports, workerId) => {
      const worker = workersMap.get(workerId);
      if (!worker) return;

      const totalSum = workerShiftReports.reduce((sum, shiftReport) => {
        return sum + (shiftReport.dailyShiftPayout || 0);
      }, 0);

      result.push({
        hrWorkerId: workerId,
        name: worker.name,
        hrPositionId: worker.hrPositionId,
        billingMonth: billingMonth,
        dailySalary: worker.dailySalary,
        maxBonusSalary: worker.bonusPayout,
        countShifts: workerShiftReports.length,
        sum: totalSum,
      });
    });

    return result;
  }
}
