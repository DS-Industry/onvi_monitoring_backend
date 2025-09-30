import { StatusHrWorker } from '@prisma/client';

export interface UpdateDto {
  name?: string;
  hrPositionId?: number;
  placementId?: number;
  startWorkDate?: Date;
  phone?: string;
  email?: string;
  description?: string;
  monthlySalary?: number;
  dailySalary?: number;
  percentageSalary?: number;
  status?: StatusHrWorker;
  gender?: string;
  citizenship?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportExtradition?: string;
  passportDateIssue?: Date;
  inn?: string;
  snils?: string;
  registrationAddress?: string;
}
