import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { PrismaService } from '@db/prisma/prisma.service';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { PrismaCorporateMapper } from '@db/mapper/prisma-corporate-mapper';
import { CorporateCardsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-cards-paginated-response.dto';

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
      include: {
        workers: {
          include: {
            card: {
              include: {
                cardTier: true,
              },
            },
          },
        },
      },
    });

    if (!corporate) {
      return {
        data: [],
        total: 0,
        skip: skip || 0,
        take: take || 10,
      };
    }

    let workersWithCards = corporate.workers.filter(worker => worker.card);

    if (search) {
      workersWithCards = workersWithCards.filter(worker => 
        worker.name.toLowerCase().includes(search.toLowerCase()) ||
        worker.card.unqNumber.toLowerCase().includes(search.toLowerCase()) ||
        worker.card.number.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = workersWithCards.length;

    const paginatedWorkers = workersWithCards
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(skip || 0, (skip || 0) + (take || 10));

    const data = paginatedWorkers.map(worker => ({
      id: worker.card.id,
      ownerName: worker.name,
      cardUnqNumber: worker.card.unqNumber,
      cardNumber: worker.card.number,
      cardBalance: worker.card.balance,
      cardTier: worker.card.cardTier ? {
        name: worker.card.cardTier.name,
        limitBenefit: worker.card.cardTier.limitBenefit,
      } : null,
    }));

    return {
      data,
      total,
      skip: skip || 0,
      take: take || 10,
    };
  }
}
