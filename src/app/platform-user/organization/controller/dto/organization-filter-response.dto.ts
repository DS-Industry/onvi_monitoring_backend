import { StatusOrganization, TypeOrganization } from "@prisma/client";

export class OrganizationFilterResponseDto {
  id: number;
  name: string;
  slug: string;
  address: string;
  organizationStatus: StatusOrganization;
  organizationType: TypeOrganization;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
}