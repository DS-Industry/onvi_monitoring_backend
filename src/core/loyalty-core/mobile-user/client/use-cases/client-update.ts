import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { ClientUpdateDto } from '@loyalty/mobile-user/client/use-cases/dto/client-update.dto';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(input: ClientUpdateDto, oldClient: Client) {
    const {
      name,
      birthday,
      status,
      avatar,
      contractType,
      comment,
      placementId,
      refreshTokenId,
      gender,
      cardId,
      email
    } = input;

    oldClient.name = name ? name : oldClient.name;

    oldClient.birthday = birthday ? birthday : oldClient.birthday;
    oldClient.avatar = avatar ? avatar : oldClient.avatar;
    oldClient.refreshTokenId = refreshTokenId
      ? refreshTokenId
      : oldClient.refreshTokenId;
    oldClient.status = status ? status : oldClient.status;
    oldClient.contractType = contractType
      ? contractType
      : oldClient.contractType;
    oldClient.comment = comment ? comment : oldClient.comment;
    oldClient.placementId = placementId ? placementId : oldClient.placementId;
    oldClient.gender = gender ? gender : oldClient.gender;
    oldClient.updatedAt = new Date(Date.now());
    oldClient.email = email ? email : oldClient.email;
    const client = await this.clientRepository.update(oldClient);
    
    let card;
    
    if (cardId) {
      // Validate cardId
      if (cardId <= 0) {
        throw new Error(`Invalid cardId: ${cardId}. Card ID must be a positive number.`);
      }
      
      // Handle card reassignment
      const newCard = await this.findMethodsCardUseCase.getById(cardId);
      if (!newCard) {
        throw new Error(`Card with id ${cardId} not found`);
      }
      
      // Check if the new card is already assigned to another client
      if (newCard.mobileUserId && newCard.mobileUserId !== client.id) {
        throw new Error(`Card with id ${cardId} is already assigned to another client`);
      }
      
      // Unassign old card from current client
      const oldCard = await this.findMethodsCardUseCase.getByClientId(client.id);
      if (oldCard) {
        oldCard.mobileUserId = null;
        await this.updateCardUseCase.execute(
          {
            mobileUserId: null,
          },
          oldCard,
        );
      }
      
      // Assign new card to current client
      newCard.mobileUserId = client.id;
      card = await this.updateCardUseCase.execute(
        {
          mobileUserId: client.id,
        },
        newCard,
      );
    } else {
      // Update existing card without reassignment (only if balance, monthlyLimit, or loyaltyCardTierId are provided)
      if (input.balance !== undefined || input.monthlyLimit !== undefined || input.loyaltyCardTierId !== undefined) {
        const oldCard = await this.findMethodsCardUseCase.getByClientId(client.id);
        if (oldCard) {
          card = await this.updateCardUseCase.execute(
            {
              balance: input?.balance,
              monthlyLimit: input?.monthlyLimit,
              loyaltyCardTierId: input?.loyaltyCardTierId,
            },
            oldCard,
          );
        }
      } else {
        // If no card updates are needed, just get the current card for the response
        card = await this.findMethodsCardUseCase.getByClientId(client.id);
      }
    }

    let clientTags = await this.findMethodsTagUseCase.getAllByClientId(
      client.id,
    );
    if (input.tagIds) {
      const existingTagIds = clientTags.map((tag) => tag.id);

      const deleteTagIds = existingTagIds.filter(
        (id) => !input.tagIds.includes(id),
      );
      const addTagIds = input.tagIds.filter(
        (id) => !existingTagIds.includes(id),
      );
      await this.clientRepository.updateConnectionTag(
        client.id,
        addTagIds,
        deleteTagIds,
      );
      clientTags = await this.findMethodsTagUseCase.getAllByClientId(client.id);
    }

    return {
      id: client.id,
      name: client.name,
      birthday: client.birthday,
      phone: client.phone,
      email: client?.email,
      gender: client?.gender,
      status: client.status,
      contractType: client.contractType,
      comment: client?.comment,
      refreshTokenId: client?.refreshTokenId,
      placementId: client?.placementId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      tags: clientTags.map((tag) => tag.getProps()),
      card: card ? {
        id: card.id,
        balance: card.balance,
        mobileUserId: card.mobileUserId,
        devNumber: card.devNumber,
        number: card.number,
        monthlyLimit: card?.monthlyLimit,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      } : null,
    };
  }
}
