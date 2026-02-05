import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { FindMethodsClientUseCase } from './client-find-methods';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { UpdateCardFieldsUseCase } from '@loyalty/mobile-user/card/use-case/card-update-fields';
import { CardStatus } from '@loyalty/mobile-user/card/domain/enums';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly updateCardFieldsUseCase: UpdateCardFieldsUseCase,
  ) {}

  async execute(id: number): Promise<void> {
    const client = await this.findMethodsClientUseCase.getById(id);

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.status === StatusUser.DELETED) {
      throw new Error('Client already deleted');
    }

    client.status = StatusUser.DELETED;
    client.updatedAt = new Date();

    await this.clientRepository.update(client);

    const card = await this.findMethodsCardUseCase.getByClientId(id);
    if (card) {
      await this.updateCardFieldsUseCase.execute(card.id, {
        status: CardStatus.INACTIVE,
      });
    }
  }
}
