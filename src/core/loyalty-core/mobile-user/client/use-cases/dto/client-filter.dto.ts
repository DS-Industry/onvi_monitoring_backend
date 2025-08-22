import { ContractType } from '@prisma/client';

export class ClientFilterDto {
  placementId: number | '*';
  contractType: ContractType | '*';
  workerCorporateId: number | '*';
  tagIds: number[];
  phone?: string;
  skip?: number;
  take?: number;
  registrationFrom?: string;
  registrationTo?: string;
  search?: string;
}
