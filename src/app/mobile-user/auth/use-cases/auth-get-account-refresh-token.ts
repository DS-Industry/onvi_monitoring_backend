import { Injectable } from '@nestjs/common';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { Client } from '@mobile-user/client/domain/client';

@Injectable()
export class GetClientIfRefreshTokenMatchesUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(refreshToken: string, phone: string): Promise<Client> {
    const client = await this.clientRepository.findOneByPhone(phone);
    if (!client) {
      throw new Error('phone not exists');
    }

    const isRefreshingTokenMatching = await this.bcrypt.compare(
      refreshToken,
      client.refreshTokenId,
    );

    if (isRefreshingTokenMatching) {
      return client;
    }
  }
}
