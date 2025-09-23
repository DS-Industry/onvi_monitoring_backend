import {
  LTYProgram as PrismaLoyaltyProgram,
  Prisma,
  LTYProgramHubRequest,
} from '@prisma/client';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export class PrismaLoyaltyProgramMapper {
  static toDomain(
    entity: PrismaLoyaltyProgram & { hubRequest?: LTYProgramHubRequest },
  ): LTYProgram {
    if (!entity) {
      return null;
    }
    return new LTYProgram({
      id: entity.id,
      name: entity.name,
      status: entity.status,
      startDate: entity.startDate,
      lifetimeDays: entity.lifetimeBonusDays,
      ownerOrganizationId: entity.ownerOrganizationId,
      isHub: entity.isHub,
      isHubRequested: entity.hubRequest ? true : false,
    });
  }

  static toPrisma(loyaltyProgram: LTYProgram): Prisma.LTYProgramCreateInput {
    return {
      name: loyaltyProgram.name,
      status: loyaltyProgram.status,
      startDate: loyaltyProgram.startDate,
      lifetimeBonusDays: loyaltyProgram?.lifetimeDays,
      ownerOrganization: loyaltyProgram.ownerOrganizationId
        ? { connect: { id: loyaltyProgram.ownerOrganizationId } }
        : undefined,
    };
  }
}
