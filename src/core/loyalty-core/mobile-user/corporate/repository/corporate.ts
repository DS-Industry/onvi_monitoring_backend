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
}
