import { Organization } from '@organization/organization/domain/organization';
import { Organization as PrismaOrganization, Prisma } from '@prisma/client';

export class PrismaOrganizationMapper {
  static toDomain(
    entity: PrismaOrganization & {
      ownedLtyPrograms?: { id: number; name: string }[];
    },
  ): Organization {
    if (!entity) {
      return null;
    }
    return new Organization({
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      address: entity.address,
      organizationDocumentId: entity.organizationDocumentId,
      organizationStatus: entity.organizationStatus,
      organizationType: entity.organizationType,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ownerId: entity.ownerId,
      ltyPrograms: entity.ownedLtyPrograms,
    });
  }

  static toPrisma(
    organization: Organization,
  ): Prisma.OrganizationUncheckedCreateInput {
    return {
      id: organization?.id,
      name: organization.name,
      slug: organization.slug,
      address: organization?.address,
      organizationDocumentId: organization.organizationDocumentId,
      organizationStatus: organization.organizationStatus,
      organizationType: organization.organizationType,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      ownerId: organization?.ownerId,
    };
  }
}
