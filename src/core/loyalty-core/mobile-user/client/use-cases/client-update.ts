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
      type,
      inn,
      comment,
      placementId,
      refreshTokenId,
    } = input;

    oldClient.name = name ? name : oldClient.name;
    oldClient.birthday = birthday ? birthday : oldClient.birthday;
    oldClient.avatar = avatar ? avatar : oldClient.avatar;
    oldClient.refreshTokenId = refreshTokenId
      ? refreshTokenId
      : oldClient.refreshTokenId;
    oldClient.status = status ? status : oldClient.status;
    oldClient.type = type ? type : oldClient.type;
    oldClient.inn = inn ? inn : oldClient.inn;
    oldClient.comment = comment ? comment : oldClient.comment;
    oldClient.placementId = placementId ? placementId : oldClient.placementId;

    oldClient.updatedAt = new Date(Date.now());
    const client = await this.clientRepository.update(oldClient);
    const oldCard = await this.findMethodsCardUseCase.getByClientId(client.id);
    const card = await this.updateCardUseCase.execute(
      { balance: input?.balance, monthlyLimit: input?.monthlyLimit },
      oldCard,
    );

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
      type: client.type,
      inn: client?.inn,
      comment: client?.comment,
      refreshTokenId: client?.refreshTokenId,
      placementId: client?.placementId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      tags: clientTags.map((tag) => tag.getProps()),
      card: {
        id: card.id,
        balance: card.balance,
        mobileUserId: card.mobileUserId,
        devNumber: card.devNumber,
        number: card.number,
        monthlyLimit: card?.monthlyLimit,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      },
    };
  }
}
