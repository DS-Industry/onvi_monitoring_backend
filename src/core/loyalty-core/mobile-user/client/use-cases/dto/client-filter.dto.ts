import { ContractType } from '@prisma/client';

export class ClientFilterDto {
  placementId: number | '*';
  type: ContractType | '*';
  tagIds: number[];
  phone?: string;
  skip?: number;
  take?: number;
}
