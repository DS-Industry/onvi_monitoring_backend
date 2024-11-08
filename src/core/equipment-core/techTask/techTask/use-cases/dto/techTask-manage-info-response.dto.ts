import { PeriodTechTask, StatusTechTask, TypeTechTask } from '@prisma/client';

export class TechTaskManageInfoResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  period: PeriodTechTask;
  nextCreateDate?: Date;
  startDate: Date;
  items: TechTaskItemDto[];
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}

export class TechTaskItemDto {
  id: number;
  title: string;
}
