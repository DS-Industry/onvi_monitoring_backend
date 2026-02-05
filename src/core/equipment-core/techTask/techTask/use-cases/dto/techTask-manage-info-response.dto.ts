import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { TechTagProps } from '@tech-task/tag/domain/techTag';
import { PeriodType } from '../../domain/periodType';

export class TechTaskManageInfoResponseDto {
  techTaskManageInfo: TechTaskManageInfoResponse[];
  totalCount: number;
}

export class TechTaskManageInfoResponse {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  periodType?: PeriodType;
  customPeriodDays?: number;
  markdownDescription?: string;
  nextCreateDate?: Date;
  endSpecifiedDate?: Date;
  startDate: Date;
  items: TechTaskItemDto[];
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
  templateToNextCreate: boolean;
  tags: TechTagProps[];
}

export class TechTaskItemDto {
  id: number;
  title: string;
}
