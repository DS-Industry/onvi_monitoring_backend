import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@loyalty/mobile-user/client/interfaces/client';
import { ClientCreateDto } from '@loyalty/mobile-user/client/use-cases/dto/client-create.dto';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { StatusUser } from '@prisma/client';
import { CreateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-create';
import { ClientFullResponseDto } from '@platform-user/core-controller/dto/response/client-full-response.dto';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';

@Injectable()
export class CreateClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
  ) {}

  async execute(data: ClientCreateDto): Promise<ClientFullResponseDto> {

    const cleanPhone = data.phone.replace(/^\+/, '')

    const clientData = new Client({
      name: data.name,
      birthday: data?.birthday,
      phone: cleanPhone,
      email: data?.email,
      gender: data?.gender,
      status: StatusUser.VERIFICATE,
      contractType: data?.contractType,
      comment: data?.comment,
      placementId: data?.placementId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    const client = await this.clientRepository.create(clientData);
    
    let card;
    
    if (data.cardId) {
      if (data.cardId <= 0) {
        throw new Error(`Invalid cardId: ${data.cardId}. Card ID must be a positive number.`);
      }
      
      const existingCard = await this.findMethodsCardUseCase.getById(data.cardId);
      if (!existingCard) {
        throw new Error(`Card with id ${data.cardId} not found`);
      }
      
      if (existingCard.mobileUserId) {
        throw new Error(`Card with id ${data.cardId} is already assigned to another client`);
      }
      
      existingCard.mobileUserId = client.id;
      card = await this.updateCardUseCase.execute(
        {
          mobileUserId: client.id,
        },
        existingCard,
      );
    } else {
      card = await this.createCardUseCase.execute({
        mobileUserId: client.id,
        devNumber: data?.devNumber,
        number: data?.number,
        monthlyLimit: data?.monthlyLimit,
      });
    }
    
  
    const tagIds = data.tagIds || [];
    await this.clientRepository.updateConnectionTag(client.id, tagIds, []);
    const clientTags = await this.findMethodsTagUseCase.getAllByClientId(
      client.id,
    );

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
