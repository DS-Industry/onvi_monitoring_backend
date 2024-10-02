import { TypeOrganization } from '@prisma/client';

export class OrganizationCreateDto {
  name: string;
  organizationType: TypeOrganization;
  address: {
    city: string;
    location: string;
    lat?: number;
    lon?: number;
  };
}
