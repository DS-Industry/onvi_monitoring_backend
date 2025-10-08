import { Injectable } from '@nestjs/common';
import { FindMethodsPaymentUseCase } from '@hr/payment/use-case/payment-find-methods';
import { PaymentsGetResponseDto } from '@platform-user/core-controller/dto/response/payments-get-response.dto';
import { ReportFilterDto } from '@hr/payment/use-case/dto/report-filter.dto';
import { PaymentType } from '@prisma/client';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { PrepaymentsGetResponseDto } from '@platform-user/core-controller/dto/response/prepayments-get-response.dto';

@Injectable()
export class GetReportPaymentUseCase {
  constructor(
    private readonly findMethodsPaymentUseCase: FindMethodsPaymentUseCase,
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
  ) {}
  async prepayment(
    data: ReportFilterDto,
  ): Promise<PrepaymentsGetResponseDto[]> {
    const prepayments = await this.findMethodsPaymentUseCase.getAllByFilter(
      data.startPaymentDate,
      data.endPaymentDate,
      data.hrWorkerId,
      PaymentType.PREPAYMENT,
      data.billingMonth,
      data.skip,
      data.take,
    );

    if (prepayments.length === 0) {
      return [];
    }

    const workerIds = [...new Set(prepayments.map((p) => p.hrWorkerId))];

    const workers = await this.findMethodsWorkerUseCase.getAllByIds(workerIds);
    const workersMap = new Map(workers.map((w) => [w.id, w]));

    return prepayments.map((payment) => {
      const worker = workersMap.get(payment.hrWorkerId);

      return {
        hrWorkerId: worker.id,
        employeeName: worker.name,
        name: worker.name,
        hrPositionId: worker.hrPositionId,
        billingMonth: payment.billingMonth,
        dailySalary: worker.dailySalary,
        bonusPayout: worker.bonusPayout,
        numberOfShiftsWorked: payment.countShifts,
        sum: payment.sum,
        payoutTimestamp: payment.createdAt,
        createdAt: payment.createdAt,
        createdById: payment.createdById,
      };
    });
  }

  async prepaymentCount(data: ReportFilterDto): Promise<number> {
    return await this.findMethodsPaymentUseCase.getCountByFilter(
      data.startPaymentDate,
      data.endPaymentDate,
      data.hrWorkerId,
      PaymentType.PREPAYMENT,
      data.billingMonth,
    );
  }

  async payment(data: ReportFilterDto): Promise<PaymentsGetResponseDto[]> {
    const paymentPayments = await this.findMethodsPaymentUseCase.getAllByFilter(
      data.startPaymentDate,
      data.endPaymentDate,
      data.hrWorkerId,
      PaymentType.PAYMENT,
      data.billingMonth,
      data.skip,
      data.take,
    );
    if (paymentPayments.length === 0) {
      return [];
    }

    const workerIds = [...new Set(paymentPayments.map((p) => p.hrWorkerId))];

    const prepayments = await this.findMethodsPaymentUseCase.getAllForCalculate(
      workerIds,
      PaymentType.PREPAYMENT,
      data.billingMonth,
    );

    const workers = await this.findMethodsWorkerUseCase.getAllByIds(workerIds);
    const workersMap = new Map(workers.map((w) => [w.id, w]));

    const prepaymentMap = prepayments.reduce((map, payment) => {
      const currentSum = map.get(payment.hrWorkerId) || 0;
      map.set(payment.hrWorkerId, currentSum + payment.sum);
      return map;
    }, new Map<number, number>());
    return paymentPayments.map((payment) => {
      const worker = workersMap.get(payment.hrWorkerId);

      return {
        hrWorkerId: worker.id,
        name: worker.name,
        hrPositionId: worker.hrPositionId,
        billingMonth: payment.billingMonth,
        paymentDate: payment.paymentDate,
        dailySalary: worker.dailySalary,
        bonusPayout: worker.bonusPayout,
        countShifts: payment.countShifts,
        prepaymentSum: prepaymentMap.get(payment.hrWorkerId) || 0,
        paymentSum: payment.sum,
        prize: payment.prize,
        fine: payment.fine,
        virtualSum: payment?.virtualSum,
        comment: payment?.comment,
        totalPayment:
          payment.sum -
          (prepaymentMap.get(payment.hrWorkerId) || 0) +
          payment.prize -
          payment.fine,
        totalPaymentFinal:
          payment.sum -
          (prepaymentMap.get(payment.hrWorkerId) || 0) +
          payment.prize -
          payment.fine -
          (payment?.virtualSum || 0),
        createdAt: payment.createdAt,
        createdById: payment.createdById,
      };
    });
  }
}
