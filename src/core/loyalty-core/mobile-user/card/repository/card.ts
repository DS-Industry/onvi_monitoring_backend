import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { PrismaService } from '@db/prisma/prisma.service';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { PrismaCardMobileUserMapper } from '@db/mapper/prisma-card-mobile-user-mapper';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';

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

  public async findOneById(id: number): Promise<Card> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientId(id: number): Promise<Card> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: id,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByUnqNumber(unqNumber: string): Promise<Card> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        unqNumber,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByNumber(number: string): Promise<Card> {
    const card = await this.prisma.lTYCard.findFirst({
      where: {
        number,
      },
    });
    return PrismaCardMobileUserMapper.toDomain(card);
  }

  public async findOneByClientPhone(phone: string): Promise<Card> {
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
  ): Promise<LoyaltyCardInfoFullResponseDto> {
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
}
