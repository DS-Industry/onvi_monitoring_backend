import { PeriodTechTask, TypeTechTask } from '@prisma/client';

export class TechTaskCreateDto {
  name: string;
  posId: number;
  type: TypeTechTask;
  period: PeriodTechTask;
  startDate: Date;
  techTaskItem: number[];
}