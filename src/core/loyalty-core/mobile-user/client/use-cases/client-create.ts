import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@loyalty/mobile-user/client/interfaces/client';
import { ClientCreateDto } from '@loyalty/mobile-user/client/use-cases/dto/client-create.dto';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { StatusUser } from '@prisma/client';
import { CreateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-create';
import { ClientFullResponseDto } from '@platform-user/core-controller/dto/response/client-full-response.dto';
import { FindMethodsTagUseCase } from "@loyalty/mobile-user/tag/use-cases/tag-find-methods";

@Injectable()
export class CreateClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
  ) {}

  async execute(data: ClientCreateDto): Promise<ClientFullResponseDto> {
    const clientData = new Client({
      name: data.name,
      birthday: data?.birthday,
      phone: data.phone,
      email: data?.email,
      gender: data?.gender,
      status: StatusUser.VERIFICATE,
      type: data?.type,
      inn: data?.inn,
      comment: data?.comment,
      placementId: data?.placementId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    const client = await this.clientRepository.create(clientData);
    const card = await this.createCardUseCase.execute({
      mobileUserId: client.id,
      devNumber: data?.devNumber,
      number: data?.number,
      monthlyLimit: data?.monthlyLimit,
    });
    await this.clientRepository.updateConnectionTag(client.id, data.tagIds, []);
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
