import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { Payment } from '@hr/payment/domain/payment';
import { PaymentType } from '@prisma/client';

@Injectable()
export class FindMethodsPaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async getById(id: number): Promise<Payment> {
    return await this.paymentRepository.findOneById(id);
  }

  async getAllByFilter(
    startPaymentDate?: Date | '*',
    endPaymentDate?: Date | '*',
    hrWorkerId?: number | '*',
    paymentType?: PaymentType | '*',
    billingMonth?: Date | '*',
    skip?: number,
    take?: number,
  ): Promise<Payment[]> {
    let startPaymentDateCorrect = undefined;
    let endPaymentDateCorrect = undefined;
    let hrWorkerIdCorrect = undefined;
    let paymentTypeCorrect = undefined;
    let billingMonthCorrect = undefined;
    if (startPaymentDate != '*') {
      startPaymentDateCorrect = startPaymentDate;
    }
    if (endPaymentDate != '*') {
      endPaymentDateCorrect = endPaymentDate;
    }
    if (hrWorkerId != '*') {
      hrWorkerIdCorrect = hrWorkerId;
    }
    if (paymentType != '*') {
      paymentTypeCorrect = paymentType;
    }
    if (billingMonth != '*') {
      billingMonthCorrect = billingMonth;
    }

    return await this.paymentRepository.findAllByFilter(
      startPaymentDateCorrect,
      endPaymentDateCorrect,
      hrWorkerIdCorrect,
      paymentTypeCorrect,
      billingMonthCorrect,
      skip,
      take,
    );
  }

  async getAllForCalculate(
    hrWorkerIds: number[],
    paymentType: PaymentType,
    billingMonth?: Date | '*',
  ): Promise<Payment[]> {
    let billingMonthCorrect = undefined;
    if (billingMonth != '*') {
      billingMonthCorrect = billingMonth;
    }
    return await this.paymentRepository.findAllForCalculate(
      hrWorkerIds,
      paymentType,
      billingMonthCorrect,
    );
  }

  async getCountByFilter(
    startPaymentDate?: Date | '*',
    endPaymentDate?: Date | '*',
    hrWorkerId?: number | '*',
    paymentType?: PaymentType | '*',
    billingMonth?: Date | '*',
  ): Promise<number> {
    let startPaymentDateCorrect = undefined;
    let endPaymentDateCorrect = undefined;
    let hrWorkerIdCorrect = undefined;
    let paymentTypeCorrect = undefined;
    let billingMonthCorrect = undefined;
    if (startPaymentDate != '*') {
      startPaymentDateCorrect = startPaymentDate;
    }
    if (endPaymentDate != '*') {
      endPaymentDateCorrect = endPaymentDate;
    }
    if (hrWorkerId != '*') {
      hrWorkerIdCorrect = hrWorkerId;
    }
    if (paymentType != '*') {
      paymentTypeCorrect = paymentType;
    }
    if (billingMonth != '*') {
      billingMonthCorrect = billingMonth;
    }

    return await this.paymentRepository.findCountByFilter(
      startPaymentDateCorrect,
      endPaymentDateCorrect,
      hrWorkerIdCorrect,
      paymentTypeCorrect,
      billingMonthCorrect,
    );
  }
}
