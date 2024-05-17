import { ConfirmMail } from '@platform-admin/confirmMail/domain/confirmMail';
import {
  PlatformUserMailConfirm as PrismaAdminMailConfirm,
  Prisma,
} from '@prisma/client';
export class PrismaPlatformAdminMailConfirmMapper {
  static toDomain(entity: PrismaAdminMailConfirm): ConfirmMail {
    if (!entity) {
      return null;
    }
    return new ConfirmMail({
      id: entity.id,
      email: entity.email,
      confirmString: entity.confirmString,
      createDate: entity.createdAt,
      expireDate: entity.expireAt,
    });
  }

  static toPrisma(
    confirmMail: ConfirmMail,
  ): Prisma.PlatformUserMailConfirmUncheckedCreateInput {
    return {
      id: confirmMail?.id,
      email: confirmMail.email,
      confirmString: confirmMail.confirmString,
      createdAt: confirmMail?.createDate,
      expireAt: confirmMail.expireDate,
    };
  }
}
