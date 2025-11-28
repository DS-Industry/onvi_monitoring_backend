export interface CreateDto {
  name: string;
  hrPositionId: number;
  placementId: number;
  organizationId: number;
  startWorkDate?: Date;
  phone?: string;
  email?: string;
  description?: string;
  monthlySalary: number;
  dailySalary: number;
  bonusPayout: number;
  gender?: string;
  birthday?: Date;
  citizenship?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportExtradition?: string;
  passportDateIssue?: Date;
  inn?: string;
  snils?: string;
  registrationAddress?: string;
}
