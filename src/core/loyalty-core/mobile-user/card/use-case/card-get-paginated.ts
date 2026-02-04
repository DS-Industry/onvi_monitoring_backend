import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import {
  CardsPaginatedResponseDto,
  CardResponseDto,
} from '@platform-user/core-controller/dto/response/card-paginated-response.dto';
import { LTYCardType } from '@prisma/client';

@Injectable()
export class GetCardsPaginatedUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(data: {
    organizationId: number;
    unqNumber?: string;
    number?: string;
    type?: LTYCardType;
    isCorporate?: boolean;
    page?: number;
    size?: number;
  }): Promise<CardsPaginatedResponseDto> {
    const result = await this.cardRepository.getAllPaginated({
      organizationId: data.organizationId,
      unqNumber: data.unqNumber,
      number: data.number,
      type: data.type,
      isCorporate: data.isCorporate,
      page: data.page || 1,
      size: data.size || 10,
    });

    const cardResponses: CardResponseDto[] = result.cards.map((card) => ({
      id: card.id,
      balance: card.balance,
      unqNumber: card.devNumber,
      number: card.number,
      type: card.type as LTYCardType,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      cardTier: card.cardTier
        ? {
            id: card.cardTier.id,
            name: card.cardTier.name,
            description: card.cardTier.description,
            limitBenefit: card.cardTier.limitBenefit,
          }
        : null,
      isCorporate: card.isCorporate,
    }));

    return {
      cards: cardResponses,
      total: result.total,
      page: data.page || 1,
      size: data.size || 10,
    };
  }
}
