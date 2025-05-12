import { GroupTechTaskItemTemplate, StatusTechTask, TypeTechTask, TypeTechTaskItemTemplate } from "@prisma/client";
import { TechTagProps } from "@tech-task/tag/domain/techTag";

export class TechTaskShapeResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  period?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  items: TechTaskItemDto[];
  tags: TechTagProps[];
}

export class TechTaskItemDto {
  id: number;
  title: string;
  type: TypeTechTaskItemTemplate;
  group: GroupTechTaskItemTemplate;
  code: string;
  value?: string;
  image?: string;
}
