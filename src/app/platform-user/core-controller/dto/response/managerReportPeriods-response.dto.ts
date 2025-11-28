import { ManagerReportPeriodStatus } from '@prisma/client';

export class ManagerReportPeriodsResponseDto {
  managerReportPeriods: ReportPeriodResponse[];
  totalCount: number;
}

export class ReportPeriodResponse {
  id: number;
  period: string;
  sumStartPeriod: number;
  sumEndPeriod: number;
  shortage: number;
  userId: number;
  status: ManagerReportPeriodStatus;
}
