import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { PrismaService } from '@db/prisma/prisma.service';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';
import { PrismaCorporateMapper } from '@db/mapper/prisma-corporate-mapper';
import { CorporateClientsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-clients-paginated-response.dto';
import { CorporateClientResponseDto } from '@platform-user/core-controller/dto/response/corporate-client-response.dto';

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
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    skip?: number,
    take?: number,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<CorporateClientResponseDto[]> {
    const where: any = {
      contractType: 'CORPORATE',
    };

    // Build where clause based on filter parameters
    if (placementId !== undefined && placementId !== null) {
      where.placementId = placementId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
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

    return corporates.map((corporate) => {
      const corporateData = {
        id: corporate.id,
        name: corporate.name,
        inn: corporate.inn || '',
        ownerPhone: corporate.owner?.phone,
        address: corporate.address,
        dateRegistered: String(corporate.createdAt),
      };

      return corporateData;
    });
  }

  public async countByFilter(
    placementId?: number,
    search?: string,
    inn?: string,
    ownerPhone?: string,
    name?: string,
    registrationFrom?: string,
    registrationTo?: string,
  ): Promise<number> {
    const where: any = {
      contractType: 'CORPORATE',
    };

    // Build where clause based on filter parameters (same logic as findAllByFilter)
    if (placementId !== undefined && placementId !== null) {
      where.placementId = placementId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
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

    return await this.prisma.lTYUser.count({ where });
  }
}
