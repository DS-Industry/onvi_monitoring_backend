import { Injectable } from '@nestjs/common';
import { UpdateClientUseCase } from '../../../../core/loyalty-core/mobile-user/client/use-cases/client-update';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { Client } from '../../../../core/loyalty-core/mobile-user/client/domain/client';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ClientFullResponseDto } from "@platform-user/core-controller/dto/response/client-full-response.dto";

@Injectable()
export class SetRefreshTokenUseCase {
  constructor(
    private readonly clientUpdate: UpdateClientUseCase,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(id: number, token: string): Promise<ClientFullResponseDto> {
    const hashedRefreshToken = await this.bcrypt.hash(token);
    const client = await this.findMethodsClientUseCase.getById(id);
    return await this.clientUpdate.execute(
      {
        refreshTokenId: hashedRefreshToken,
      },
      client,
    );
  }
}
