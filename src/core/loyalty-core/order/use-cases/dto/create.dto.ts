import {
  ExecutionStatus,
  OrderStatus,
  PlatformType,
  SendAnswerStatus,
  UserType,
} from '@prisma/client';

export class CreateDto {
  transactionId: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  carWashDeviceId: number;
  platform: PlatformType;
  orderData: Date;
  typeMobileUser?: UserType;
  cardMobileUserId?: number;
  orderStatus: OrderStatus;
  sendAnswerStatus?: SendAnswerStatus;
  sendTime?: Date;
  debitingMoney?: Date;
  executionStatus?: ExecutionStatus;
  reasonError?: string;
  executionError?: string;
}
