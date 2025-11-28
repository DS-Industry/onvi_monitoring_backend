import { ManagerPaperGroup } from '@prisma/client';

export class CreateDto {
  group: ManagerPaperGroup;
  posId: number;
  paperTypeId: number;
  eventDate: Date;
  sum: number;
  userId: number;
  comment?: string;
  cashCollectionId?: number;
}
