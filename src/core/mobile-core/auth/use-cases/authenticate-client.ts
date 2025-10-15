import { Injectable } from '@nestjs/common';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { ITokenService } from '../interfaces/token-service';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientSession } from '../domain/client-session';

export interface AuthenticateClientRequest {
  client: Client;
}

export interface AuthenticateClientResponse {
  client: Client;
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExp: Date;
    refreshTokenExp: Date;
  };
}

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private readonly authRepository: IClientAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(request: AuthenticateClientRequest): Promise<AuthenticateClientResponse> {
    const { client } = request;

    const tokens = await this.tokenService.generateTokens({
      phone: client.phone,
      clientId: client.id,
    });

    let session = await this.authRepository.findSessionByClientId(client.id);
    
    if (!session) {
      session = new ClientSession({
        clientId: client.id,
        phone: client.phone,
        isActive: true,
        createdAt: new Date(),
      });
    }
    
    session.setRefreshToken(tokens.refreshToken);
    
    if (session.id) {
      await this.authRepository.updateSession(session);
    } else {
      await this.authRepository.createSession(session);
    }

    return {
      client,
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExp: tokens.accessTokenExpiresAt,
        refreshTokenExp: tokens.refreshTokenExpiresAt,
      },
    };
  }
}
