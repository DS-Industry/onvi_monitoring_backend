import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { PeriodType } from '../../domain/periodType';

export class TechTaskUpdateDto {
  name?: string;
  type?: TypeTechTask;
  status?: StatusTechTask;
  periodType?: PeriodType;
  customPeriodDays?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  techTaskItem?: number[];
  tagIds?: number[];
  templateToNextCreate?: boolean;
}
