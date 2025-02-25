import { PeriodTechTask, TypeTechTask } from '@prisma/client';

export class TechTaskCreateDto {
  name: string;
  posId: number;
  type: TypeTechTask;
  period: PeriodTechTask;
  endSpecifiedDate?: Date;
  startDate: Date;
  techTaskItem: number[];
}