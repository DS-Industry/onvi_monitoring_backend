import { PaymentType } from '@prisma/client';

export interface CreateDto {
  hrWorkerId: number;
  paymentType: PaymentType;
  paymentDate: Date;
  billingMonth: Date;
  countShifts: number;
  sum: number;
  prize: number;
  fine: number;
}
