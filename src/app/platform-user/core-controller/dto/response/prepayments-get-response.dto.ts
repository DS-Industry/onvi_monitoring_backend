export interface PrepaymentsGetResponseDto {
  hrWorkerId: number;
  employeeName: string; 
  name: string; 
  hrPositionId: number;
  salaryPeriod: Date;
  billingMonth: Date; 
  paymentDate: Date;
  monthlySalary: number;
  dailySalary: number;
  bonusPayout: number;
  numberOfShiftsWorked: number; 
  countShifts: number; 
  advanceSalary: number; 
  sum: number;
  maxAdvanceSalary: number;
  payoutTimestamp: Date; 
  createdAt: Date;
  createdById: number;
}