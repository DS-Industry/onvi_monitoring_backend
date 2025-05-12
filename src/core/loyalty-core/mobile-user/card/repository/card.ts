import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { PrismaService } from '@db/prisma/prisma.service';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { PrismaCardMobileUserMapper } from '@db/mapper/prisma-card-mobile-user-mapper';

@Injectable()
export class CardRepository extends ICardRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Card): Promise<Card> {
    const cardEntity = PrismaCardMobileUserMapper.toPrisma(input);
    const card = await this.prisma.cardMobileUser.create({ data: cardEntity });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneById(id: number): Promise<Card> {
    const card = await this.prisma.cardMobileUser.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientId(id: number): Promise<Card> {
    const card = await this.prisma.cardMobileUser.findFirst({
      where: {
        mobileUserId: id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByDevNumber(devNumber: string): Promise<Card> {
    const card = await this.prisma.cardMobileUser.findFirst({
      where: {
        devNumber,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByNumber(number: string): Promise<Card> {
    const card = await this.prisma.cardMobileUser.findFirst({
      where: {
        number,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientPhone(phone: string): Promise<Card> {
    const card = await this.prisma.cardMobileUser.findFirst({
      where: {
        mobileUser: {
          phone,
        },
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async update(input: Card): Promise<Card> {
    const cardEntity = PrismaCardMobileUserMapper.toPrisma(input);
    const card = await this.prisma.cardMobileUser.update({
      where: { id: input.id },
      data: cardEntity,
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }
}
