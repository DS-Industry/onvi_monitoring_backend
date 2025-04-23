import { TypeTechTask } from '@prisma/client';

export class TechTaskCreateDto {
  name: string;
  posId: number;
  type: TypeTechTask;
  period?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  startDate: Date;
  techTaskItem: number[];
  tagIds: number[];
}