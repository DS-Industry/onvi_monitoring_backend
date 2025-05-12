import { UserType } from '@prisma/client';

export class ClientFilterDto {
  placementId: number | '*';
  type: UserType | '*';
  tagIds: number[];
  phone?: string;
  skip?: number;
  take?: number;
}
