import { Otp } from '@mobile-user/otp/domain/otp';
import { Otp as PrismaOtp, Prisma } from '@prisma/client';

export class PrismaOtpMapper {
  static toDomain(entity: PrismaOtp): Otp {
    if (!entity) {
      return null;
    }
    return new Otp({
      id: entity.id,
      phone: entity.phone,
      confirmCode: entity.confirmCode,
      createDate: entity.createdAt,
      expireDate: entity.expireAt,
    });
  }

  static toPrisma(otp: Otp): Prisma.OtpUncheckedCreateInput {
    return {
      id: otp?.id,
      phone: otp.phone,
      confirmCode: otp.confirmCode,
      createdAt: otp?.createDate,
      expireAt: otp.expireDate,
    };
  }
}
