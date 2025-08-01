export interface PaymentCalculateResponseDro {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  dailySalary: number;
  maxBonusSalary: number;
  prepaymentSum: number;
  prepaymentCountShifts: number;
  sum: number;
  countShifts: number;
}