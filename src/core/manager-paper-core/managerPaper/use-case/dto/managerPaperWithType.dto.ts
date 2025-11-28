import { ManagerPaperGroup, ManagerPaperTypeClass } from '@prisma/client';

export class ManagerPaperWithTypeDto {
  id: number;
  group: ManagerPaperGroup;
  posId: number;
  paperTypeId: number;
  paperTypeName: string;
  paperTypeType: ManagerPaperTypeClass;
  eventDate: Date;
  sum: number;
  userId: number;
  imageProductReceipt?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}
