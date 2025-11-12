import { Injectable } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { FindMethodsClientUseCase } from './client-find-methods';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
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
  }
}
