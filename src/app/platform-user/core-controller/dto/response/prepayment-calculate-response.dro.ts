export interface PrepaymentCalculateResponseDro {
  hrWorkerId: number;
  employeeName: string;
  name: string;
  hrPositionId: number;
  billingMonth: Date;
  dailySalary: number;
  bonusPayout: number;
  numberOfShiftsWorked: number;
  sum: number;
  payoutTimestamp?: Date;
}