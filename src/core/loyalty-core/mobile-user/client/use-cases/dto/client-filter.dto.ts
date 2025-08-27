import { ContractType } from '@prisma/client';

export class ClientFilterDto {
  placementId: number | '*';
  contractType: ContractType | '*';
  workerCorporateId: number | '*';
  organizationId: number | '*';
  tagIds: number[];
  phone?: string;
  name?: string;
  page?: number;
  size?: number;
  skip?: number;
  take?: number;
  registrationFrom?: string;
  registrationTo?: string;
  search?: string;
}
