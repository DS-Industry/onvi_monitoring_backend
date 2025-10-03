export interface PrepaymentsGetResponseDto {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  paymentDate: Date;
  monthlySalary: number;
  dailySalary: number;
  bonusPayout: number;
  countShifts: number;
  sum: number;
  createdAt: Date;
  createdById: number;
}