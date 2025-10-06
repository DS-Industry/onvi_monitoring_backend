import { Payment } from '@hr/payment/domain/payment';
import { PaymentType } from '@prisma/client';

export abstract class IPaymentRepository {
  abstract create(input: Payment): Promise<Payment>;
  abstract createMany(input: Payment[]): Promise<any>;
  abstract findOneById(id: number): Promise<Payment>;
  abstract findAllByFilter(
    startPaymentDate?: Date,
    endPaymentDate?: Date,
    hrWorkerId?: number,
    paymentType?: PaymentType,
    billingMonth?: Date,
    skip?: number,
    take?: number,
  ): Promise<Payment[]>;
  abstract findAllForCalculate(
    hrWorkerIds: number[],
    paymentType: PaymentType,
    billingMonth: Date,
  ): Promise<Payment[]>;
  abstract findCountByFilter(
    startPaymentDate?: Date,
    endPaymentDate?: Date,
    hrWorkerId?: number,
    paymentType?: PaymentType,
    billingMonth?: Date,
  ): Promise<number>;
  abstract update(input: Payment): Promise<Payment>;
}
