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
      roleId: entity.roleId,
      confirmString: entity.confirmString,
      name: entity.name,
      surname: entity.surname,
      middlename: entity.middlename,
      phone: entity.phone,
      position: entity.position,
      birthday: entity.birthday,
      status: entity.status,
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
      roleId: confirmMail?.roleId,
      confirmString: confirmMail.confirmString,
      name: confirmMail.name,
      surname: confirmMail?.surname,
      middlename: confirmMail?.middlename,
      phone: confirmMail.phone,
      position: confirmMail.position,
      birthday: confirmMail.birthday,
      status: confirmMail.status,
      createdAt: confirmMail?.createDate,
      expireAt: confirmMail.expireDate,
    };
  }
}
