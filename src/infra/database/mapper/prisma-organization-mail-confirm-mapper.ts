import { OrganizationConfirmMail } from '@organization/confirmMail/domain/confirmMail';
import {
  OrganizationMailConfirm as PrismaOrganizationMailConfirm,
  Prisma,
} from '@prisma/client';

export class PrismaOrganizationMailConfirmMapper {
  static toDomain(
    entity: PrismaOrganizationMailConfirm,
  ): OrganizationConfirmMail {
    if (!entity) {
      return null;
    }
    return new OrganizationConfirmMail({
      id: entity.id,
      email: entity.email,
      organizationId: entity.organizationId,
      confirmString: entity.confirmString,
      createDate: entity.createdAt,
      expireDate: entity.expireAt,
    });
  }

  static toPrisma(
    confirmMail: OrganizationConfirmMail,
  ): Prisma.OrganizationMailConfirmUncheckedCreateInput {
    return {
      id: confirmMail?.id,
      email: confirmMail.email,
      organizationId: confirmMail.organizationId,
      confirmString: confirmMail.confirmString,
      createdAt: confirmMail?.createDate,
      expireAt: confirmMail.expireDate,
    };
  }
}
