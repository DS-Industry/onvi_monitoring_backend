import { StatusTechTask, TypeTechTask } from '@prisma/client';

export class TechTaskUpdateDto {
  name?: string;
  type?: TypeTechTask;
  status?: StatusTechTask;
  period?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  techTaskItem?: number[];
  tagIds?: number[];
}
