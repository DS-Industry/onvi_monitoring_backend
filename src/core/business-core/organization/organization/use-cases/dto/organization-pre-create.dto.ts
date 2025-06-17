import { TypeOrganization } from "@prisma/client";

export class OrganizationPreCreateDto{
  fullName: string;
  organizationType: TypeOrganization;
  addressRegistration: string;
}