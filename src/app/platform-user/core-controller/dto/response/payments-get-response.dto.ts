export interface PaymentsGetResponseDto {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  paymentDate: Date;
  dailySalary: number;
  bonusPayout: number;
  numberOfShiftsWorked: number;
  prepaymentSum: number;
  paymentSum: number;
  prize: number;
  fine: number;
  virtualSum?: number;
  comment?: string;
  totalPayment: number;
  totalPaymentFinal: number;
  createdAt: Date;
  createdById: number;
}