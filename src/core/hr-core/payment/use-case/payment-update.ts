import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { UpdateDto } from '@hr/payment/use-case/dto/update.dto';
import { Payment } from '@hr/payment/domain/payment';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(
    input: UpdateDto,
    oldPayment: Payment,
    user: User,
  ): Promise<Payment> {
    const { paymentDate, sum, prize, fine, virtualSum, comment } = input;

    oldPayment.paymentDate = paymentDate ?? oldPayment.paymentDate;
    oldPayment.sum = sum ?? oldPayment.sum;
    oldPayment.prize = prize ?? oldPayment.prize;
    oldPayment.fine = fine ?? oldPayment.fine;
    oldPayment.virtualSum = virtualSum ?? oldPayment.virtualSum;
    oldPayment.comment = comment ?? oldPayment.comment;

    oldPayment.updatedAt = new Date(Date.now());
    oldPayment.updatedById = user.id;
    return await this.paymentRepository.update(oldPayment);
  }
}
