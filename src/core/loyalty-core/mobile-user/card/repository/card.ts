import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { PrismaService } from '@db/prisma/prisma.service';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { PrismaCardMobileUserMapper } from '@db/mapper/prisma-card-mobile-user-mapper';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { Prisma } from '@prisma/client';
import { ClientKeyStatsDto } from '@platform-user/core-controller/dto/receive/client-key-stats.dto';
import { CardsFilterDto } from '@platform-user/core-controller/dto/receive/cards.filter.dto';
import { UserKeyStatsResponseDto } from '@platform-user/core-controller/dto/response/user-key-stats-response.dto';
import { ClientLoyaltyStatsDto } from '@platform-user/core-controller/dto/receive/client-loyalty-stats.dto';
import { ClientLoyaltyStatsResponseDto } from '@platform-user/core-controller/dto/response/client-loyalty-stats-response.dto';

@Injectable()
export class CardRepository extends ICardRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Card): Promise<Card> {
    const cardEntity = PrismaCardMobileUserMapper.toPrisma(input);
    const card = await this.prisma.lTYCard.create({ data: cardEntity });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneById(id: number): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientId(id: number): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByUnqNumber(unqNumber: string): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        unqNumber,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByNumber(number: string): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        number,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientPhone(phone: string): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        client: {
          phone,
        },
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findFullCardInfoForDevice(
    unqNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { unqNumber },
      include: {
        client: true,
        cardTier: {
          include: {
            benefits: true,
            ltyProgram: {
              include: {
                organizations: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return PrismaCardMobileUserMapper.toLoyaltyCardInfoFullDto(card);
  }

  public async update(input: Card): Promise<Card> {
    const cardEntity = PrismaCardMobileUserMapper.toPrisma(input);
    const card = await this.prisma.lTYCard.update({
      where: { id: input.id },
      data: cardEntity,
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async getAll({
    unqNumber,
    organizationId,
    unnasigned,
  }: CardsFilterDto) {
    const where: Prisma.LTYCardWhereInput = {};

    if (unqNumber) {
      where.unqNumber = unqNumber;
    }

    if (organizationId) {
      where.cardTier = {
        ltyProgram: {
          organizations: {
            some: {
              id: organizationId,
            },
          },
        },
      };
    }

    if (unnasigned) {
      where.client = null;
    }

    const cards = await this.prisma.lTYCard.findMany({
      where,
      include: {
        client: true,
        cardTier: {
          include: {
            benefits: true,
            ltyProgram: {
              include: {
                organizations: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    return cards.map((card) => PrismaCardMobileUserMapper.toDomain(card));
  }

  public async getUserKeyStatsByOrganization(data: ClientKeyStatsDto): Promise<UserKeyStatsResponseDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      throw new Error(`Organization with id ${data.organizationId} not found`);
    }

    const client = await this.prisma.lTYUser.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new Error(`Client with id ${data.clientId} not found`);
    }

    const card = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: data.clientId,
      },
      include: {
        client: true,
        cardTier: {
          include: {
            ltyProgram: {
              include: {
                organizations: {
                  where: {
                    id: data.organizationId,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!card) {
      throw new Error(`Card not found for client ${data.clientId}`);
    }

    if (!card.cardTier?.ltyProgram?.organizations || card.cardTier.ltyProgram.organizations.length === 0) {
      throw new Error(`Card does not belong to organization ${data.organizationId}`);
    }

    const orders = await this.prisma.lTYOrder.findMany({
      where: {
        cardId: card.id,
        carWashDevice: {
          carWasPos: {
            pos: {
              organizationId: data.organizationId,
            },
          },
        },
        orderStatus: 'COMPLETED',
      },
      select: {
        sumReal: true,
        orderData: true,
      },
      orderBy: {
        orderData: 'asc',
      },
    });

    const totalOrdersCount = orders.length;
    const totalAmountSpent = orders.reduce((sum, order) => sum + order.sumReal, 0);
    const averageOrderAmount = totalOrdersCount > 0 ? totalAmountSpent / totalOrdersCount : 0;
    const firstOrderDate = orders.length > 0 ? orders[0].orderData : undefined;
    const lastOrderDate = orders.length > 0 ? orders[orders.length - 1].orderData : undefined;

    return {
      clientId: data.clientId,
      organizationId: data.organizationId,
      organizationName: organization.name,
      clientName: client.name,
      totalAmountSpent,
      averageOrderAmount: Math.round(averageOrderAmount),
      totalOrdersCount,
      cardBalance: card.balance,
      lastOrderDate,
      firstOrderDate,
      cardNumber: card.number,
      cardDevNumber: card.unqNumber,
    };
  }

  public async getClientLoyaltyStats(data: ClientLoyaltyStatsDto): Promise<ClientLoyaltyStatsResponseDto> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      throw new Error(`Organization with id ${data.organizationId} not found`);
    }

    const client = await this.prisma.lTYUser.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new Error(`Client with id ${data.clientId} not found`);
    }

    const card = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: data.clientId,
      },
      include: {
        client: true,
        cardTier: {
          include: {
            ltyProgram: {
              include: {
                organizations: {
                  where: {
                    id: data.organizationId,
                  },
                },
                cardTiers: {
                  orderBy: {
                    id: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(card);

    if (!card) {
      throw new Error(`Card not found for client ${data.clientId}`);
    }

    if (!card.cardTier) {
      throw new Error(`Card tier not found for client ${data.clientId}`);
    }

    if (!card.cardTier?.ltyProgram?.organizations || card.cardTier.ltyProgram.organizations.length === 0) {
      throw new Error(`Card does not belong to organization ${data.organizationId}`);
    }

    const orders = await this.prisma.lTYOrder.findMany({
      where: {
        cardId: card.id,
        carWashDevice: {
          carWasPos: {
            pos: {
              organizationId: data.organizationId,
            },
          },
        },
        orderStatus: 'COMPLETED',
      },
      select: {
        sumReal: true,
        sumBonus: true,
        orderData: true,
      },
    });

    const totalPurchaseAmount = orders.reduce((sum, order) => sum + order.sumReal, 0);
    
    const totalBonusEarned = orders.reduce((sum, order) => sum + order.sumBonus, 0);
    
    const activeBonuses = await this.prisma.lTYBonusBank.aggregate({
      where: {
        cardId: card.id,
        expiryAt: {
          gt: new Date(),
        },
      },
      _sum: {
        sum: true,
      },
    });
    
    const activeBonusesSum = activeBonuses._sum.sum || 0;

    const accumulatedAmount = totalPurchaseAmount + totalBonusEarned;

    const allTiers = card.cardTier?.ltyProgram?.cardTiers || [];
    const currentTierIndex = allTiers.findIndex(tier => tier.id === card.cardTierId);
    const nextTier = currentTierIndex >= 0 && currentTierIndex < allTiers.length - 1 ? allTiers[currentTierIndex + 1] : null;

    console.log("allTiers: ", allTiers);

    let amountToNextTier = 0;
    let nextTierName = null;
    let nextTierId = null;
    let nextTierThreshold = 0;
    
    if (nextTier) {
      const currentTierId = card.cardTierId || 1;
      const nextTierIdValue = nextTier.id;
      
      const currentTierBenefitLimit = card.cardTier?.limitBenefit || 0;
      const nextTierBenefitLimit = nextTier.limitBenefit || 0;
      
      console.log('Tier progression calculation:', {
        currentTierId,
        nextTierId: nextTierIdValue,
        currentTierBenefitLimit,
        nextTierBenefitLimit,
        accumulatedAmount,
      });
      
      if (nextTierBenefitLimit > currentTierBenefitLimit) {

        nextTierThreshold = nextTierBenefitLimit - currentTierBenefitLimit;
        
        amountToNextTier = Math.max(0, nextTierThreshold - accumulatedAmount);
        
        console.log('Tier threshold calculation:', {
          nextTierThreshold,
          amountToNextTier,
          calculation: `${nextTierBenefitLimit} - ${currentTierBenefitLimit} = ${nextTierThreshold}`,
        });
      }
      
      nextTierName = nextTier.name;
      nextTierId = nextTier.id;
    }

    return {
      clientId: data.clientId,
      organizationId: data.organizationId,
      organizationName: organization.name,
      clientName: client.name,
      
      
      totalPurchaseAmount,
      accumulatedAmount,
      amountToNextTier,
      
      activeBonuses: activeBonusesSum,
      totalBonusEarned,
      
      cardNumber: card.number,
      cardDevNumber: card.unqNumber,
      
      currentTierName: card.cardTier?.name,
      currentTierId: card.cardTierId,
      currentTierDescription: card.cardTier?.description,
      
      nextTierName: nextTierName,
      nextTierId: nextTierId,
      nextTierDescription: nextTier?.description,
      
      isHighestTier: !nextTier,
      tierProgressPercentage: nextTier ? 
        Math.min(100, Math.max(0, Math.round((accumulatedAmount / (nextTierThreshold || 1)) * 100))) : 
        100,
    };
  }

  public async validateOrganizationExists(organizationId: number): Promise<boolean> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    return !!organization;
  }

  public async validateTierExistsAndAccessible(tierId: number, organizationId: number): Promise<boolean> {
    const tier = await this.prisma.lTYCardTier.findFirst({
      where: {
        id: tierId,
        ltyProgram: {
          organizations: {
            some: {
              id: organizationId,
            },
          },
        },
      },
    });
    return !!tier;
  }

  public async checkCardExists(devNumber: string, uniqueNumber: string): Promise<boolean> {
    const existingCard = await this.prisma.lTYCard.findFirst({
      where: {
        OR: [
          { unqNumber: devNumber },
          { number: uniqueNumber },
        ],
      },
    });
    return !!existingCard;
  }
}
