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
        name: worker.name,
        hrPositionId: worker.hrPositionId,
        billingMonth: payment.billingMonth,
        paymentDate: payment.paymentDate,
        monthlySalary: worker.monthlySalary,
        dailySalary: worker.dailySalary,
        bonusPayout: worker.bonusPayout,
        countShifts: payment.countShifts,
        sum: payment.sum,
        createdAt: payment.createdAt,
        createdById: payment.createdById,
      };
    });
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
        monthlySalary: worker.monthlySalary,
        dailySalary: worker.dailySalary,
        bonusPayout: worker.bonusPayout,
        countShifts: payment.countShifts,
        prepaymentSum: prepaymentMap.get(payment.hrWorkerId) || 0,
        paymentSum: payment.sum,
        prize: payment.prize,
        fine: payment.fine,
        totalPayment:
          (prepaymentMap.get(payment.hrWorkerId) || 0) +
          payment.sum +
          payment.prize -
          payment.fine,
        createdAt: payment.createdAt,
        createdById: payment.createdById,
      };
    });
  }
}
