import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { Payment } from '@hr/payment/domain/payment';

@Injectable()
export class DeletePaymentUseCase {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(input: Payment): Promise<void> {
    await this.paymentRepository.delete(input.id);
  }
}
