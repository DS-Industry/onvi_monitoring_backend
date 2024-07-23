import { Injectable } from '@nestjs/common';
import { UpdateClientUseCase } from '@mobile-user/client/use-cases/client-update';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { Client } from '@mobile-user/client/domain/client';

@Injectable()
export class SetRefreshTokenUseCase {
  constructor(
    private readonly clientUpdate: UpdateClientUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(id: number, token: string): Promise<Client> {
    const hashedRefreshToken = await this.bcrypt.hash(token);
    return await this.clientUpdate.execute({
      id: id,
      refreshTokenId: hashedRefreshToken,
    });
  }
}
