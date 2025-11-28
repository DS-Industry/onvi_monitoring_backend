import { StatusOrganization, TypeOrganization } from '@prisma/client';

export class OrganizationFilterResponseDto {
  id: number;
  name: string;
  slug: string;
  address: string;
  organizationDocumentId?: number;
  organizationStatus: StatusOrganization;
  organizationType: TypeOrganization;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
}
