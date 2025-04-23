import { Provider } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { PaymentRepository } from '@hr/payment/repository/payment';

export const PaymentRepositoryProvider: Provider = {
  provide: IPaymentRepository,
  useClass: PaymentRepository,
};
