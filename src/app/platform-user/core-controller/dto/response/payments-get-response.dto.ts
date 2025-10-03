export interface PaymentsGetResponseDto {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  paymentDate: Date;
  monthlySalary: number;
  dailySalary: number;
  bonusPayout: number;
  countShifts: number;
  prepaymentSum: number;
  paymentSum: number;
  prize: number;
  fine: number;
  totalPayment: number;
  createdAt: Date;
  createdById: number;
}