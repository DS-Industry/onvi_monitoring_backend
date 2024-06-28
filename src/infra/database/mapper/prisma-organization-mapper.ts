import { Organization } from '@organization/organization/domain/organization';
import { Organization as PrismaOrganization, Prisma } from '@prisma/client';

export class PrismaOrganizationMapper {
  static toDomain(entity: PrismaOrganization): Organization {
    if (!entity) {
      return null;
    }
    return new Organization({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      addressId: entity.addressId,
      organizationDocumentId: entity.organizationDocumentId,
      organizationStatus: entity.organizationStatus,
      organizationType: entity.organizationType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ownerId: entity.ownerId,
    });
  }

  static toPrisma(
    organization: Organization,
  ): Prisma.OrganizationUncheckedCreateInput {
    return {
      id: organization?.id,
      name: organization.name,
      slug: organization.slug,
      addressId: organization?.addressId,
      organizationDocumentId: organization.organizationDocumentId,
      organizationStatus: organization.organizationStatus,
      organizationType: organization.organizationType,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      ownerId: organization?.ownerId,
    };
  }
}
