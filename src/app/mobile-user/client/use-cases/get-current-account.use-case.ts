import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ClientMetaRepository } from '../infrastructure/client-meta.repository';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientMeta } from '../domain/client-meta.entity';

@Injectable()
export class GetCurrentAccountUseCase {
  constructor(
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly clientMetaRepository: ClientMetaRepository,
  ) {}

  async execute(clientId: number): Promise<{
    client: Client;
    meta?: ClientMeta;
  }> {
    const client = await this.findMethodsClientUseCase.getById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const meta = await this.clientMetaRepository.findByClientId(clientId);

    return {
      client,
      meta,
    };
  }
}
