import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { PrismaService } from '@db/prisma/prisma.service';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { PrismaLoyaltyTierMapper } from '@db/mapper/prisma-loyalty-tier-mapper';
import { LoyaltyTierUpdateInfoResponseDto } from '@loyalty/loyalty/loyaltyTier/use-cases/dto/loyaltyTier-update-info-response.dto';

@Injectable()
export class LoyaltyTierRepository extends ILoyaltyTierRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: LoyaltyTier): Promise<LoyaltyTier> {
    const loyaltyTierEntity = PrismaLoyaltyTierMapper.toPrisma(input);
    const loyaltyTier = await this.prisma.lTYCardTier.create({
      data: loyaltyTierEntity,
    });
    return PrismaLoyaltyTierMapper.toDomain(loyaltyTier);
  }

  public async findOneById(id: number): Promise<LoyaltyTier> {
    const loyaltyTier = await this.prisma.lTYCardTier.findFirst({
      where: {
        id,
      },
    });
    return PrismaLoyaltyTierMapper.toDomain(loyaltyTier);
  }

  public async findAllByLoyaltyProgramId(
    ltyProgramId: number,
    onlyWithoutChildren: boolean = false,
  ): Promise<LoyaltyTier[]> {
    let whereClause: any = {
      ltyProgramId,
    };

    if (onlyWithoutChildren) {
      whereClause = {
        ...whereClause,
        NOT: {
          downCardTiers: {
            some: {},
          },
        },
      };
    }

    const loyaltyTiers = await this.prisma.lTYCardTier.findMany({
      where: whereClause,
    });

    return loyaltyTiers.map((item) => PrismaLoyaltyTierMapper.toDomain(item));
  }

  public async findAllByLoyaltyProgramIds(
    ltyProgramIds: number[],
  ): Promise<LoyaltyTier[]> {
    const loyaltyTiers = await this.prisma.lTYCardTier.findMany({
      where: {
        ltyProgramId: {
          in: ltyProgramIds,
        },
      },
    });
    return loyaltyTiers.map((item) => PrismaLoyaltyTierMapper.toDomain(item));
  }

  async findCardsForTierUpdate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<LoyaltyTierUpdateInfoResponseDto[]> {
    const result = await this.prisma.$queryRaw<
      LoyaltyTierUpdateInfoResponseDto[]
    >`
    WITH CardSpend AS (
      SELECT
        c.id as card_id,
        c."cardTierId" as current_tier_id,
        COALESCE(SUM(o."sumFull"), 0) as spent_sum
      FROM "LTYCard" c
      LEFT JOIN "LTYOrder" o ON o."cardId" = c.id
        AND o."orderData" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
        AND o."orderStatus" = 'COMPLETED'
      WHERE c."type" = 'PHYSICAL'
      GROUP BY c.id, c."cardTierId"
    )
    SELECT
      cs.card_id as "cardId",
      cs.current_tier_id as "currentTierId",
      cs.spent_sum as "spentSum",
      CASE
        WHEN cs.spent_sum >= ct."limitBenefit" THEN ct."upCardTierId"
        ELSE (SELECT id FROM "LTYCardTier" WHERE "upCardTierId" = ct.id LIMIT 1)
      END as "nextTierId",
      CASE
        WHEN cs.spent_sum >= ct."limitBenefit" AND ct."upCardTierId" IS NOT NULL THEN 'UPGRADE'::text
        WHEN cs.spent_sum < ct."limitBenefit" AND (SELECT id FROM "LTYCardTier" WHERE "upCardTierId" = ct.id LIMIT 1) IS NOT NULL THEN 'DOWNGRADE'::text
        ELSE 'NO_CHANGE'::text
      END as "actionTier"
    FROM CardSpend cs
    INNER JOIN "LTYCardTier" ct ON cs.current_tier_id = ct.id
    WHERE
      (cs.spent_sum >= ct."limitBenefit" AND ct."upCardTierId" IS NOT NULL)
      OR (cs.spent_sum < ct."limitBenefit" AND (SELECT id FROM "LTYCardTier" WHERE "upCardTierId" = ct.id LIMIT 1) IS NOT NULL)
    ORDER BY cs.card_id
  `;

    return result.filter((item) => item.actionTier !== 'NO_CHANGE');
  }

  public async update(input: LoyaltyTier): Promise<LoyaltyTier> {
    const loyaltyTierEntity = PrismaLoyaltyTierMapper.toPrisma(input);
    const loyaltyTier = await this.prisma.lTYCardTier.update({
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
    await this.prisma.lTYCardTier.update({
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
