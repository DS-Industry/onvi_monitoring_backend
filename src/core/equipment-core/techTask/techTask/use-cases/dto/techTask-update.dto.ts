import { PeriodTechTask, StatusTechTask, TypeTechTask } from '@prisma/client';

export class TechTaskUpdateDto {
  name?: string;
  type?: TypeTechTask;
  status?: StatusTechTask;
  period?: PeriodTechTask;
  endSpecifiedDate?: Date;
  techTaskItem?: number[];
}
