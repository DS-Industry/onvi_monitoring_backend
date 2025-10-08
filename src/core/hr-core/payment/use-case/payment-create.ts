import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { CreateDto } from '@hr/payment/use-case/dto/create.dto';
import { User } from '@platform-user/user/domain/user';
import { Payment } from '@hr/payment/domain/payment';

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async createOne(data: CreateDto, user: User): Promise<Payment> {
    const payment = new Payment({
      hrWorkerId: data.hrWorkerId,
      paymentType: data.paymentType,
      paymentDate: data.paymentDate,
      billingMonth: data.billingMonth,
      countShifts: data.countShifts,
      sum: data.sum,
      prize: data.prize,
      fine: data.fine,
      createdAt: new Date(Date.now()),
      createdById: user.id,
      updatedAt: new Date(Date.now()),
      updatedById: user.id,
    });

    return await this.paymentRepository.create(payment);
  }

  async createMany(paymentsData: CreateDto[], user: User): Promise<any> {
    const payments = paymentsData.map(
      (data) =>
        new Payment({
          hrWorkerId: data.hrWorkerId,
          paymentType: data.paymentType,
          paymentDate: data.paymentDate,
          billingMonth: data.billingMonth,
          countShifts: data.countShifts,
          sum: data.sum,
          prize: data.prize,
          fine: data.fine,
          virtualSum: data?.virtualSum,
          comment: data?.comment,
          createdAt: new Date(Date.now()),
          createdById: user.id,
          updatedAt: new Date(Date.now()),
          updatedById: user.id,
        }),
    );

    return await this.paymentRepository.createMany(payments);
  }
}
