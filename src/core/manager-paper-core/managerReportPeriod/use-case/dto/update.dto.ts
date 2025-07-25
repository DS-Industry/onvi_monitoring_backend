import { ManagerReportPeriodStatus } from '@prisma/client';

export class UpdateDto {
  status?: ManagerReportPeriodStatus;
  startPeriod?: Date;
  endPeriod?: Date;
  sumStartPeriod?: number;
  sumEndPeriod?: number;
  userId?: number;
}
