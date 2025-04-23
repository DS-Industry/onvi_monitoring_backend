import { Injectable } from '@nestjs/common';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { CalculateDto } from '@hr/payment/use-case/dto/calculate.dto';
import { PrepaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/prepayment-calculate-response.dro';
import { PaymentType } from '@prisma/client';
import { PaymentCalculateResponseDro } from '@platform-user/core-controller/dto/response/payment-calculate-response.dro';
import { FindMethodsPaymentUseCase } from '@hr/payment/use-case/payment-find-methods';
import { CalculateWorkersDto } from '@hr/payment/use-case/dto/calculate-workers.dto';

@Injectable()
export class CalculatePaymentUseCase {
  constructor(
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly findMethodsPaymentUseCase: FindMethodsPaymentUseCase,
  ) {}

  async prepayment(
    data: CalculateDto,
  ): Promise<PrepaymentCalculateResponseDro[]> {
    const workers =
      await this.findMethodsWorkerUseCase.getAllForCalculatePayment(
        data.organizationId,
        data.billingMonth,
        data.hrPositionId,
        '*',
      );
    return workers.map((worker) => ({
      hrWorkerId: worker.id,
      name: worker.name,
      hrPositionId: worker.hrPositionId,
      billingMonth: data.billingMonth,
      monthlySalary: worker.monthlySalary,
      dailySalary: worker.dailySalary,
      percentageSalary: worker.percentageSalary,
    }));
  }

  async prepaymentWorker(
    data: CalculateWorkersDto,
  ): Promise<PrepaymentCalculateResponseDro[]> {
    const workers =
      await this.findMethodsWorkerUseCase.getAllForCalculatePayment(
        data.organizationId,
        data.billingMonth,
        '*',
        '*',
      );
    const filteredWorkers = workers.filter(
      (worker) => !data.workerIds.includes(worker.id),
    );

    return filteredWorkers.map((worker) => ({
      hrWorkerId: worker.id,
      name: worker.name,
      hrPositionId: worker.hrPositionId,
      billingMonth: data.billingMonth,
      monthlySalary: worker.monthlySalary,
      dailySalary: worker.dailySalary,
      percentageSalary: worker.percentageSalary,
    }));
  }

  async payment(data: CalculateDto): Promise<PaymentCalculateResponseDro[]> {
    const workers =
      await this.findMethodsWorkerUseCase.getAllForCalculatePayment(
        data.organizationId,
        data.billingMonth,
        data.hrPositionId,
        PaymentType.PAYMENT,
      );
    if (workers.length === 0) {
      return [];
    }

    const prepayments = await this.findMethodsPaymentUseCase.getAllForCalculate(
      workers.map((w) => w.id),
      PaymentType.PREPAYMENT,
      data.billingMonth,
    );

    const prepaymentSumMap = new Map<number, number>();
    const prepaymentCountShiftsMap = new Map<number, number>();

    prepayments.forEach((payment) => {
      const currentSum = prepaymentSumMap.get(payment.hrWorkerId) || 0;
      prepaymentSumMap.set(payment.hrWorkerId, currentSum + payment.sum);

      const currentCount =
        prepaymentCountShiftsMap.get(payment.hrWorkerId) || 0;
      prepaymentCountShiftsMap.set(
        payment.hrWorkerId,
        currentCount + payment.countShifts,
      );
    });

    return workers.map((worker) => ({
      hrWorkerId: worker.id,
      name: worker.name,
      hrPositionId: worker.hrPositionId,
      billingMonth: data.billingMonth,
      monthlySalary: worker.monthlySalary,
      dailySalary: worker.dailySalary,
      percentageSalary: worker.percentageSalary,
      prepaymentSum: prepaymentSumMap.get(worker.id) || 0,
      prepaymentCountShifts: prepaymentCountShiftsMap.get(worker.id) || 0,
    }));
  }

  async paymentWorker(
    data: CalculateWorkersDto,
  ): Promise<PaymentCalculateResponseDro[]> {
    const workers =
      await this.findMethodsWorkerUseCase.getAllForCalculatePayment(
        data.organizationId,
        data.billingMonth,
        '*',
        PaymentType.PAYMENT,
      );
    if (workers.length === 0) {
      return [];
    }

    const filteredWorkers = workers.filter(
      (worker) => !data.workerIds.includes(worker.id),
    );

    const prepayments = await this.findMethodsPaymentUseCase.getAllForCalculate(
      filteredWorkers.map((w) => w.id),
      PaymentType.PREPAYMENT,
      data.billingMonth,
    );

    const prepaymentSumMap = new Map<number, number>();
    const prepaymentCountShiftsMap = new Map<number, number>();

    prepayments.forEach((payment) => {
      const currentSum = prepaymentSumMap.get(payment.hrWorkerId) || 0;
      prepaymentSumMap.set(payment.hrWorkerId, currentSum + payment.sum);

      const currentCount =
        prepaymentCountShiftsMap.get(payment.hrWorkerId) || 0;
      prepaymentCountShiftsMap.set(
        payment.hrWorkerId,
        currentCount + payment.countShifts,
      );
    });

    return filteredWorkers.map((worker) => ({
      hrWorkerId: worker.id,
      name: worker.name,
      hrPositionId: worker.hrPositionId,
      billingMonth: data.billingMonth,
      monthlySalary: worker.monthlySalary,
      dailySalary: worker.dailySalary,
      percentageSalary: worker.percentageSalary,
      prepaymentSum: prepaymentSumMap.get(worker.id) || 0,
      prepaymentCountShifts: prepaymentCountShiftsMap.get(worker.id) || 0,
    }));
  }
}
