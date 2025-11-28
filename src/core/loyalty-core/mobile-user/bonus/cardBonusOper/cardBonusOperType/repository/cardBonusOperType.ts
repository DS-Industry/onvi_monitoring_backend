import { Injectable } from '@nestjs/common';
import { ICardBonusOperTypeRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/interface/cardBonusOperType';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardBonusOperType } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/domain/cardBonusOperType';
import { PrismaCardBonusOperTypeMapper } from '@db/mapper/prisma-card-bonus-oper-type-mapper';

@Injectable()
export class CardBonusOperTypeRepository extends ICardBonusOperTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CardBonusOperType): Promise<CardBonusOperType> {
    const cardBonusOperTypeEntity =
      PrismaCardBonusOperTypeMapper.toPrisma(input);
    const cardBonusOperType = await this.prisma.lTYBonusOperType.create({
      data: cardBonusOperTypeEntity,
    });
    return PrismaCardBonusOperTypeMapper.toDomain(cardBonusOperType);
  }

  public async findOneById(id: number): Promise<CardBonusOperType> {
    const cardBonusOperType = await this.prisma.lTYBonusOperType.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardBonusOperTypeMapper.toDomain(cardBonusOperType);
  }

  public async findAll(): Promise<CardBonusOperType[]> {
    const cardBonusOperTypes = await this.prisma.lTYBonusOperType.findMany();
    return cardBonusOperTypes.map((item) =>
      PrismaCardBonusOperTypeMapper.toDomain(item),
    );
  }
}
