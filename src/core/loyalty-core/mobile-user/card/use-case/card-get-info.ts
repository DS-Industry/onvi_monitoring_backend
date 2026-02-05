import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { CardInfoResponseDto } from '@platform-user/core-controller/dto/response/card-paginated-response.dto';
import { EnumMapper } from '@db/mapper/enum-mapper';

@Injectable()
export class GetCardInfoUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(cardId: number): Promise<CardInfoResponseDto | null> {
    const card = await this.cardRepository.getCardInfoById(cardId);

    if (!card) {
      return null;
    }

    return {
      id: card.id,
      balance: card.balance,
      unqNumber: card.unqNumber,
      number: card.number,
      type: EnumMapper.toPrismaCardType(card.type),
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      status: card.status ? EnumMapper.toPrismaCardStatus(card.status) : null,
      cardTier: card.cardTier
        ? {
            id: card.cardTier.id,
            name: card.cardTier.name,
            description: card.cardTier.description,
            limitBenefit: card.cardTier.limitBenefit,
            ltyProgramId: card.cardTier.ltyProgramId,
          }
        : null,
      corporate: card.corporate
        ? {
            id: card.corporate.id,
            name: card.corporate.name,
            inn: card.corporate.inn,
            address: card.corporate.address,
          }
        : null,
      limitBenefit: card.cardTier?.limitBenefit ?? null,
    };
  }
}
