export interface PaymentCalculateResponseDro {
  hrWorkerId: number;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  monthlySalary: number;
  dailySalary: number;
  percentageSalary: number;
  prepaymentSum: number;
  prepaymentCountShifts: number;
}