import { StatusTechTask, TypeTechTask } from "@prisma/client";
import { TechTagProps } from "@tech-task/tag/domain/techTag";
import { PeriodType } from '@tech-task/techTask/domain/periodType';

export class TechTaskResponseDto {
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
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdById: number;
  updatedById: number;
  tags: TechTagProps[];
}