import { Injectable } from '@nestjs/common';
import { IBenefitRepository } from '@loyalty/loyalty/benefit/benefit/interface/benefit';
import { PrismaService } from '@db/prisma/prisma.service';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';
import { PrismaBenefitMapper } from '@db/mapper/prisma-benefit-mapper';

@Injectable()
export class BenefitRepository extends IBenefitRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Benefit): Promise<Benefit> {
    const benefitEntity = PrismaBenefitMapper.toPrisma(input);
    const benefit = await this.prisma.lTYBenefit.create({
      data: benefitEntity,
    });
    return PrismaBenefitMapper.toDomain(benefit);
  }

  public async findOneById(id: number): Promise<Benefit> {
    const benefit = await this.prisma.lTYBenefit.findFirst({
      where: {
        id,
      },
    });
    return PrismaBenefitMapper.toDomain(benefit);
  }

  public async findAllByLoyaltyTierId(tierId: number): Promise<Benefit[]> {
    const benefits = await this.prisma.lTYBenefit.findMany({
      where: {
        cardTiers: {
          some: {
            id: tierId,
          },
        },
      },
    });
    return benefits.map((item) => PrismaBenefitMapper.toDomain(item));
  }

  public async findAll(): Promise<Benefit[]> {
    const benefits = await this.prisma.lTYBenefit.findMany();
    return benefits.map((item) => PrismaBenefitMapper.toDomain(item));
  }

  public async update(input: Benefit): Promise<Benefit> {
    const benefitEntity = PrismaBenefitMapper.toPrisma(input);
    const benefit = await this.prisma.lTYBenefit.update({
      where: { id: input.id },
      data: benefitEntity,
    });
    return PrismaBenefitMapper.toDomain(benefit);
  }
}
