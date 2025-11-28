import { Injectable } from '@nestjs/common';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class ValidateClientForJwtStrategyUseCase {
  constructor(private readonly clientRepository: FindMethodsClientUseCase) {}

  async execute(phone: string): Promise<Client> {
    const client = await this.clientRepository.getByPhone(phone);

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.status !== StatusUser.ACTIVE) {
      throw new Error('Client account is not active');
    }

    return client;
  }
}
