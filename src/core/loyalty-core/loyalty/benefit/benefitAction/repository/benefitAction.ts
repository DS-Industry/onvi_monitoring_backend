import { Injectable } from '@nestjs/common';
import { IBenefitActionRepository } from '@loyalty/loyalty/benefit/benefitAction/interface/benefitAction';
import { PrismaService } from '@db/prisma/prisma.service';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';
import { PrismaBenefitActionMapper } from '@db/mapper/prisma-benefit-action-mapper';

@Injectable()
export class BenefitActionRepository extends IBenefitActionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: BenefitAction): Promise<BenefitAction> {
    const benefitActionEntity = PrismaBenefitActionMapper.toPrisma(input);
    const benefitAction = await this.prisma.lTYBenefitActionType.create({
      data: benefitActionEntity,
    });
    return PrismaBenefitActionMapper.toDomain(benefitAction);
  }

  public async findOneById(id: number): Promise<BenefitAction> {
    const benefitAction = await this.prisma.lTYBenefitActionType.findFirst({
      where: { id },
    });
    return PrismaBenefitActionMapper.toDomain(benefitAction);
  }

  public async findAll(): Promise<BenefitAction[]> {
    const benefitActions = await this.prisma.lTYBenefitActionType.findMany();
    return benefitActions.map((item) =>
      PrismaBenefitActionMapper.toDomain(item),
    );
  }

  public async update(input: BenefitAction): Promise<BenefitAction> {
    const benefitActionEntity = PrismaBenefitActionMapper.toPrisma(input);
    const benefitAction = await this.prisma.lTYBenefitActionType.update({
      where: {
        id: input.id,
      },
      data: benefitActionEntity,
    });
    return PrismaBenefitActionMapper.toDomain(benefitAction);
  }
}
