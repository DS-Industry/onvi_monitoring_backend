import {
  LTYProgram as PrismaLoyaltyProgram,
  Prisma,
  LTYProgramHubRequest,
  LTYProgramRequestStatus,
  LTYProgramParticipant,
} from '@prisma/client';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { EnumMapper } from './enum-mapper';

export class PrismaLoyaltyProgramMapper {
  static toDomain(
    entity: PrismaLoyaltyProgram & { hubRequest?: LTYProgramHubRequest, programParticipants?: LTYProgramParticipant[] },
  ): LTYProgram {
    if (!entity) {
      return null;
    }
    return new LTYProgram({
      id: entity.id,
      name: entity.name,
      status: EnumMapper.toDomainLTYProgramStatus(entity.status),
      startDate: entity.startDate,
      lifetimeBonusDays: entity.lifetimeBonusDays,
      ownerOrganizationId: entity.ownerOrganizationId,
      isHub: entity.isHub,
      isHubRequested: entity.hubRequest ? true : false,
      isHubRejected: entity.hubRequest ? entity.hubRequest.status === LTYProgramRequestStatus.REJECTED : false,
      isPublic: (entity as any).isPublic,
      programParticipantOrganizationIds: (entity.programParticipants ?? []).map((participant) => participant.organizationId),
      description: entity.description,
      maxLevels: entity.maxLevels,
      burnoutType: (entity as any).burnoutType,
      maxRedeemPercentage: (entity as any).maxRedeemPercentage,
      hasBonusWithSale: (entity as any).hasBonusWithSale,
    });
  }

  static toPrisma(loyaltyProgram: LTYProgram): Prisma.LTYProgramCreateInput {
    return {
      name: loyaltyProgram.name,
      status: EnumMapper.toPrismaLTYProgramStatus(loyaltyProgram.status),
      startDate: loyaltyProgram.startDate,
      lifetimeBonusDays: loyaltyProgram.lifetimeBonusDays,
      isPublic: loyaltyProgram.isPublic,
      ownerOrganization: loyaltyProgram.ownerOrganizationId
        ? { connect: { id: loyaltyProgram.ownerOrganizationId } }
        : undefined,
      description: loyaltyProgram.description,
      maxLevels: loyaltyProgram.maxLevels,
      burnoutType: loyaltyProgram.burnoutType,
      maxRedeemPercentage: loyaltyProgram.maxRedeemPercentage,
      hasBonusWithSale: loyaltyProgram.hasBonusWithSale,
    } 
  }
}
