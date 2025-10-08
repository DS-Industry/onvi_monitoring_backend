import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { TechTagProps } from '@tech-task/tag/domain/techTag';
export class TechTaskReadAllResponseDto {
  techTaskReadAll: TechTaskReadAllResponse[];
  totalCount: number;
}

export class TechTaskReadAllResponse {
  id: number;
  name: string;
  posId: number;
  posName?: string;
  type: TypeTechTask;
  status: StatusTechTask;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  tags: TechTagProps[];
  createdBy?: {
    firstName: string;
    lastName: string;
  } | null;
}
