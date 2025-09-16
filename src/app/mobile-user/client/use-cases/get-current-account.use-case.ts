import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../infrastructure/client.repository';
import { ClientMetaRepository } from '../infrastructure/client-meta.repository';
import { Client } from '../domain/client.entity';
import { ClientMeta } from '../domain/client-meta.entity';

@Injectable()
export class GetCurrentAccountUseCase {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly clientMetaRepository: ClientMetaRepository,
  ) {}

  async execute(clientId: number): Promise<{
    client: Client;
    meta?: ClientMeta;
  }> {
    const client = await this.clientRepository.findById(clientId);
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
