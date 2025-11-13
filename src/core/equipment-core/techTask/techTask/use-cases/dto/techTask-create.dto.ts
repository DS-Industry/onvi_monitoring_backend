import { TypeTechTask } from '@prisma/client';
import { PeriodType } from '../../domain/periodType';

export class TechTaskCreateDto {
  name: string;
  posId: number;
  type: TypeTechTask;
  periodType?: PeriodType;
  customPeriodDays?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  startDate: Date;
  techTaskItem: number[];
  tagIds: number[];
}
