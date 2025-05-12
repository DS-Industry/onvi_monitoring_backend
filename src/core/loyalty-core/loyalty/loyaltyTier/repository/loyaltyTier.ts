import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { PrismaService } from '@db/prisma/prisma.service';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { PrismaLoyaltyTierMapper } from '@db/mapper/prisma-loyalty-tier-mapper';

@Injectable()
export class LoyaltyTierRepository extends ILoyaltyTierRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: LoyaltyTier): Promise<LoyaltyTier> {
    const loyaltyTierEntity = PrismaLoyaltyTierMapper.toPrisma(input);
    const loyaltyTier = await this.prisma.loyaltyCardTier.create({
      data: loyaltyTierEntity,
    });
    return PrismaLoyaltyTierMapper.toDomain(loyaltyTier);
  }

  public async findOneById(id: number): Promise<LoyaltyTier> {
    const loyaltyTier = await this.prisma.loyaltyCardTier.findFirst({
      where: {
        id,
      },
    });
    return PrismaLoyaltyTierMapper.toDomain(loyaltyTier);
  }

  public async findAllByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<LoyaltyTier[]> {
    const loyaltyTiers = await this.prisma.loyaltyCardTier.findMany({
      where: {
        loyaltyProgramId,
      },
    });
    return loyaltyTiers.map((item) => PrismaLoyaltyTierMapper.toDomain(item));
  }

  public async findAllByLoyaltyProgramIds(
    loyaltyProgramIds: number[],
  ): Promise<LoyaltyTier[]> {
    const loyaltyTiers = await this.prisma.loyaltyCardTier.findMany({
      where: {
        loyaltyProgramId: {
          in: loyaltyProgramIds,
        },
      },
    });
    return loyaltyTiers.map((item) => PrismaLoyaltyTierMapper.toDomain(item));
  }

  public async update(input: LoyaltyTier): Promise<LoyaltyTier> {
    const loyaltyTierEntity = PrismaLoyaltyTierMapper.toPrisma(input);
    const loyaltyTier = await this.prisma.loyaltyCardTier.update({
      where: {
        id: input.id,
      },
      data: loyaltyTierEntity,
    });
    return PrismaLoyaltyTierMapper.toDomain(loyaltyTier);
  }

  public async updateConnectionBenefit(
    loyaltyTierId: number,
    addBenefitIds: number[],
    deleteBenefitIds: number[],
  ): Promise<any> {
    await this.prisma.loyaltyCardTier.update({
      where: {
        id: loyaltyTierId,
      },
      data: {
        benefits: {
          disconnect: deleteBenefitIds.map((id) => ({ id })),
          connect: addBenefitIds.map((id) => ({ id })),
        },
      },
    });
  }
}
