import {
  ManagerPaperGroup,
  ManagerPaperTypeClass,
  ManagerReportPeriodStatus,
} from '@prisma/client';

export class GetDetailDto {
  id: number;
  status: ManagerReportPeriodStatus;
  startPeriod: Date;
  endPeriod: Date;
  sumStartPeriod: number;
  sumEndPeriod: number;
  shortage: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  createdById?: number;
  updatedById?: number;
  managerPaper: ManagerPaperForPeriodDto[];
}

export class ManagerPaperForPeriodDto {
  group: ManagerPaperGroup;
  posId: number;
  paperTypeId: number;
  paperTypeName: string;
  paperTypeType: ManagerPaperTypeClass;
  eventDate: Date;
  sum: number;
  imageProductReceipt?: string;
}
