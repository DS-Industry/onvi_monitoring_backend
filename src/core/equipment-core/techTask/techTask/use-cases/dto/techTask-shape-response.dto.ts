import { GroupTechTaskItemTemplate, StatusTechTask, TypeTechTask, TypeTechTaskItemTemplate } from "@prisma/client";

export class TechTaskShapeResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  items: TechTaskItemDto[];
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
