import { Injectable } from '@nestjs/common';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { Client } from '@mobile-user/client/domain/client';

@Injectable()
export class ValidateClientForJwtStrategyUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(phone: string): Promise<Client> {
    const client = await this.clientRepository.findOneByPhone(phone);
    if (!client) {
      throw new Error('phone not exists');
    }
    return client;
  }
}
