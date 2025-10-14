import { GroupTechTaskItemTemplate, StatusTechTask, TypeTechTask, TypeTechTaskItemTemplate } from "@prisma/client";
import { TechTagProps } from "@tech-task/tag/domain/techTag";
import { PeriodType } from '../../domain/periodType';

export class TechTaskShapeResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  periodType?: PeriodType;
  customPeriodDays?: number;
  markdownDescription?: string;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  items: TechTaskItemDto[];
  tags: TechTagProps[];
  createdBy?: {
    firstName: string;
    lastName: string;
    id: number;
  };
  executor?: {
    firstName: string;
    lastName: string;
    id: number;
  };
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
