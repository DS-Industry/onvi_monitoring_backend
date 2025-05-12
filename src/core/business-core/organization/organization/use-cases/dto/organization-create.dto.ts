import { TypeOrganization } from '@prisma/client';

export class OrganizationCreateDto {
  fullName: string;
  organizationType: TypeOrganization;
  addressRegistration: string;
  rateVat: string;
  inn: string;
  okpo: string;
  kpp?: string;
  ogrn: string;
  bik: string;
  correspondentAccount: string;
  bank: string;
  settlementAccount: string;
  addressBank: string;
  certificateNumber?: string;
  dateCertificate?: Date;
}
