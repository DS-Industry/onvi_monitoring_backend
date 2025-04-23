import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { TechTagProps } from "@tech-task/tag/domain/techTag";

export class TechTaskManageInfoResponseDto {
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
  items: TechTaskItemDto[];
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
  tags: TechTagProps[];
}

export class TechTaskItemDto {
  id: number;
  title: string;
}
