export interface PrepaymentsGetResponseDto {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  paymentDate: Date;
  monthlySalary: number;
  dailySalary: number;
  percentageSalary: number;
  countShifts: number;
  sum: number;
  createdAt: Date;
  createdById: number;
}