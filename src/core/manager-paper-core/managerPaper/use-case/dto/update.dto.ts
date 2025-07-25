import { ManagerPaperGroup } from '@prisma/client';

export class UpdateDto {
  group?: ManagerPaperGroup;
  posId?: number;
  paperTypeId?: number;
  eventDate?: Date;
  sum?: number;
  userId?: number;
  comment?: string;
}
