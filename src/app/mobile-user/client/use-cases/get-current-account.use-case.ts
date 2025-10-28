import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { IClientMetaRepository } from '@loyalty/mobile-user/client/interfaces/clientMeta';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';

@Injectable()
export class GetCurrentAccountUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly clientMetaRepository: IClientMetaRepository,
  ) {}

  async execute(clientId: number): Promise<{
    client: Client;
    meta?: ClientMeta;
  }> {
    const client = await this.findMethodsClientUseCase.getById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const meta = await this.clientMetaRepository.findOneByClientId(clientId);

    return {
      client,
      meta,
    };
  }
}
