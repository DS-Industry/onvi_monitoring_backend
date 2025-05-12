import { StatusTechTask, TypeTechTask } from "@prisma/client";
import { TechTagProps } from "@tech-task/tag/domain/techTag";

export class TechTaskResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  period?: number;
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