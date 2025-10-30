import { CreatePaymentDto, RefundPaymentDto } from './dto/create-payment.dto';

export interface IPaymentGateway {
  createPayment(data: CreatePaymentDto): Promise<any>;
  getPayment(id: string): Promise<any>;
  createRefund(data: RefundPaymentDto): Promise<any>;
}
