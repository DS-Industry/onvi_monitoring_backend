import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { PrismaService } from '@db/prisma/prisma.service';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { PrismaCorporateMapper } from '@db/mapper/prisma-corporate-mapper';

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
        workers: {
          include: {
            card: true,
          },
        },
      },
    });
    return PrismaCorporateMapper.toDomain(corporate);
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
}
