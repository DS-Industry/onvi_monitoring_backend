import { LTYProgram as PrismaLoyaltyProgram, Prisma } from '@prisma/client';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export class PrismaLoyaltyProgramMapper {
  static toDomain(entity: PrismaLoyaltyProgram): LoyaltyProgram {
    if (!entity) {
      return null;
    }
    return new LoyaltyProgram({
      id: entity.id,
      name: entity.name,
      status: entity.status,
      startDate: entity.startDate,
      lifetimeDays: entity.lifetimeBonusDays,
    });
  }

  static toPrisma(
    loyaltyProgram: LoyaltyProgram,
  ): Prisma.LTYProgramUncheckedCreateInput {
    return {
      id: loyaltyProgram?.id,
      name: loyaltyProgram.name,
      status: loyaltyProgram.status,
      startDate: loyaltyProgram.startDate,
      lifetimeBonusDays: loyaltyProgram?.lifetimeDays,
    };
  }
}
