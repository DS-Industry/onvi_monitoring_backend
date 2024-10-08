export class UpdateOrganizationDto {
  organizationId: number;
  fullName?: string;
  rateVat?: string;
  inn?: string;
  okpo?: string;
  kpp?: string;
  addressRegistration?: string;
  ogrn?: string;
  bik?: string;
  correspondentAccount?: string;
  bank?: string;
  settlementAccount?: string;
  addressBank?: string;
  certificateNumber?: string;
  dateCertificate?: Date;
}
