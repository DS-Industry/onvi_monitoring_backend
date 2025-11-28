import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { PrismaService } from '@db/prisma/prisma.service';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { PrismaCorporateMapper } from '@db/mapper/prisma-corporate-mapper';
import { CorporateCardsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-cards-paginated-response.dto';
import { CorporateCardsOperationsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-cards-operations-paginated-response.dto';

@Injectable()
export class CorporateRepository extends ICorporateRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Corporate): Promise<Corporate> {
    const corporatePrismaEntity = PrismaCorporateMapper.toPrisma(input);
    const corporate = await this.prisma.lTYCorporate.create({
      data: corporatePrismaEntity,
    });
    return PrismaCorporateMapper.toDomain(corporate);
  }

  public async findOneById(id: number): Promise<Corporate> {
    const corporate = await this.prisma.lTYCorporate.findFirst({
      where: {
        id,
      },
      include: {
        owner: true,
      },
    });

    return PrismaCorporateMapper.toDomain(corporate);
  }

  public async findOneByIdWithStats(id: number): Promise<any> {
    const corporate = await this.prisma.lTYCorporate.findFirst({
      where: {
        id,
      },
      include: {
        owner: true,
        workers: {
          include: {
            card: true,
          },
        },
      },
    });
    return corporate;
  }

  public async findAllByOwnerId(ownerId: number): Promise<Corporate[]> {
    const corporates = await this.prisma.lTYCorporate.findMany({
      where: {
        ownerId,
      },
    });
    return corporates.map((item) => PrismaCorporateMapper.toDomain(item));
  }

  public async update(input: Corporate): Promise<Corporate> {
    const corporatePrismaEntity = PrismaCorporateMapper.toPrisma(input);
    const corporate = await this.prisma.lTYCorporate.update({
      where: {
        id: input.id,
      },
      data: corporatePrismaEntity,
    });
    return PrismaCorporateMapper.toDomain(corporate);
  }

  public async findAllByFilter(
    organizationId: number,
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<Corporate[]> {
    const where: any = {
      organizationId: organizationId,
    };

    // Build where clause based on filter parameters
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { inn: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (inn) {
      where.inn = { contains: inn, mode: 'insensitive' };
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (registrationFrom || registrationTo) {
      where.createdAt = {};
      if (registrationFrom) {
        where.createdAt.gte = new Date(registrationFrom);
      }
      if (registrationTo) {
        where.createdAt.lte = new Date(registrationTo);
      }
    }

    if (placementId !== undefined && placementId !== null) {
      where.workers = {
        some: {
          placementId: placementId,
        },
      };
    }

    if (ownerPhone) {
      where.owner = {
        phone: { contains: ownerPhone, mode: 'insensitive' },
      };
    }

    const corporates = await this.prisma.lTYCorporate.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: true,
      },
    });

    return corporates.map((item) => PrismaCorporateMapper.toDomain(item));
  }

  public async countByFilter(
    organizationId: number,
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<number> {
    const where: any = {
      organizationId: organizationId,
    };

    // Build where clause based on filter parameters (same logic as findAllByFilter)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { inn: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (inn) {
      where.inn = { contains: inn, mode: 'insensitive' };
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (registrationFrom || registrationTo) {
      where.createdAt = {};
      if (registrationFrom) {
        where.createdAt.gte = new Date(registrationFrom);
      }
      if (registrationTo) {
        where.createdAt.lte = new Date(registrationTo);
      }
    }

    if (placementId !== undefined && placementId !== null) {
      where.workers = {
        some: {
          placementId: placementId,
        },
      };
    }

    if (ownerPhone) {
      where.owner = {
        phone: { contains: ownerPhone, mode: 'insensitive' },
      };
    }

    return await this.prisma.lTYCorporate.count({ where });
  }

  public async findCardsByCorporateId(
    corporateId: number,
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<CorporateCardsPaginatedResponseDto> {
    const corporate = await this.prisma.lTYCorporate.findFirst({
      where: {
        id: corporateId,
      },
    });

    if (!corporate) {
      const page = skip && take ? Math.floor(skip / take) + 1 : 1;
      const size = take || 10;
      const totalPages = 0;
      return {
        data: [],
        total: 0,
        page,
        size,
        totalPages,
        hasNext: false,
        hasPrevious: false,
      };
    }

    const where: any = {
      corporateId: corporateId,
    };

    if (search) {
      where.OR = [
        { unqNumber: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const total = await this.prisma.lTYCard.count({ where });

    const cards = await this.prisma.lTYCard.findMany({
      where,
      skip: skip || 0,
      take: take || 10,
      include: {
        client: true,
        cardTier: true,
      },
      orderBy: [
        { unqNumber: 'asc' },
      ],
    });

    const size = take || 10;
    const page = skip && take ? Math.floor(skip / take) + 1 : 1;
    const totalPages = size > 0 ? Math.ceil(total / size) : 1;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const data = cards.map((card) => ({
      id: card.id,
      ownerName: card.client?.name || '',
      cardUnqNumber: card.unqNumber,
      cardNumber: card.number,
      cardBalance: card.balance,
      cardTier: card.cardTier
        ? {
            name: card.cardTier.name,
            limitBenefit: card.cardTier.limitBenefit,
          }
        : null,
    }));

    return {
      data,
      total,
      page,
      size,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }

  public async findCardsOperationsByCorporateId(
    corporateId: number,
    skip?: number,
    take?: number,
    search?: string,
    platform?: string,
    orderStatus?: string,
    contractType?: string,
    carWashDeviceId?: number,
    dateFrom?: string,
    dateTo?: string,
    minSumFull?: number,
    maxSumFull?: number,
    minSumBonus?: number,
    maxSumBonus?: number,
  ): Promise<CorporateCardsOperationsPaginatedResponseDto> {
    const corporate = await this.prisma.lTYCorporate.findFirst({
      where: {
        id: corporateId,
      },
      include: {
        workers: {
          include: {
            card: true,
          },
        },
      },
    });

    if (!corporate) {
      const page = skip && take ? Math.floor(skip / take) + 1 : 1;
      const size = take || 10;
      const totalPages = 0;
      return {
        data: [],
        total: 0,
        page,
        size,
        totalPages,
        hasNext: false,
        hasPrevious: false,
      };
    }

    const cardIds = corporate.workers
      .filter((worker) => worker.card)
      .map((worker) => worker.card.id);

    if (cardIds.length === 0) {
      const page = skip && take ? Math.floor(skip / take) + 1 : 1;
      const size = take || 10;
      const totalPages = 0;
      return {
        data: [],
        total: 0,
        page,
        size,
        totalPages,
        hasNext: false,
        hasPrevious: false,
      };
    }

    const where: any = {
      cardId: {
        in: cardIds,
      },
    };

    if (platform) {
      where.platform = platform;
    }

    if (orderStatus) {
      where.orderStatus = orderStatus;
    }

    if (contractType) {
      where.contractType = contractType;
    }

    if (carWashDeviceId) {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (dateFrom || dateTo) {
      where.orderData = {};
      if (dateFrom) {
        where.orderData.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.orderData.lte = new Date(dateTo);
      }
    }

    if (minSumFull !== undefined) {
      where.sumFull = { ...where.sumFull, gte: minSumFull };
    }

    if (maxSumFull !== undefined) {
      where.sumFull = { ...where.sumFull, lte: maxSumFull };
    }

    if (minSumBonus !== undefined) {
      where.sumBonus = { ...where.sumBonus, gte: minSumBonus };
    }

    if (maxSumBonus !== undefined) {
      where.sumBonus = { ...where.sumBonus, lte: maxSumBonus };
    }

    if (search) {
      where.OR = [
        {
          card: {
            client: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          card: {
            unqNumber: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          card: {
            number: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          transactionId: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const total = await this.prisma.lTYOrder.count({ where });

    const orders = await this.prisma.lTYOrder.findMany({
      where,
      include: {
        card: {
          include: {
            client: true,
          },
        },
        carWashDevice: true,
      },
      orderBy: {
        orderData: 'desc',
      },
      skip: skip || 0,
      take: take || 10,
    });

    const data = orders.map((order) => ({
      id: order.id,
      transactionId: order.transactionId,
      cardId: order.cardId,
      cardUnqNumber: order.card?.unqNumber || '',
      cardNumber: order.card?.number || '',
      ownerName: order.card?.client?.name || '',
      sumFull: order.sumFull,
      sumReal: order.sumReal,
      sumBonus: order.sumBonus,
      sumDiscount: order.sumDiscount,
      sumCashback: order.sumCashback,
      platform: order.platform,
      contractType: order.contractType,
      orderData: order.orderData,
      createData: order.createData,
      orderStatus: order.orderStatus,
      orderHandlerStatus: order.orderHandlerStatus,
      carWashDeviceId: order.carWashDeviceId,
      carWashDeviceName: order.carWashDevice?.name || '',
    }));

    const size = take || 10;
    const page = skip && take ? Math.floor(skip / take) + 1 : 1;
    const totalPages = size > 0 ? Math.ceil(total / size) : 1;
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      data,
      total,
      page,
      size,
      totalPages,
      hasNext,
      hasPrevious,
    };
  }
}
