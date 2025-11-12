import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITokenService } from '../interfaces/token-service';
import {
  TokenPayload,
  TokenPair,
  AccessToken,
  RefreshToken,
} from '../domain/token-pair';
import { IJwtAdapter } from '@libs/auth/adapter';
import ms = require('ms');

@Injectable()
export class JwtTokenService extends ITokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: IJwtAdapter,
  ) {
    super();
  }

  async generateTokens(payload: TokenPayload): Promise<TokenPair> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      accessTokenExpiresAt: accessToken.expirationDate,
      refreshTokenExpiresAt: refreshToken.expirationDate,
    };
  }

  async generateAccessToken(payload: TokenPayload): Promise<AccessToken> {
    const secret = this.configService.get<string>('jwtSecret');
    const expiresIn = this.configService.get<string>('jwtExpirationTime');

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    if (!expiresIn) {
      throw new Error('JWT_EXPIRATION_TIME is not configured');
    }

    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    );

    return {
      token,
      expirationDate,
    };
  }

  async generateRefreshToken(payload: TokenPayload): Promise<RefreshToken> {
    const secret = this.configService.get<string>('jwtRefreshTokenSecret');
    const expiresIn = this.configService.get<string>(
      'jwtRefreshTokenExpiration',
    );

    if (!secret) {
      throw new Error('JWT_REFRESH_TOKEN_SECRET is not configured');
    }
    if (!expiresIn) {
      throw new Error('JWT_REFRESH_TOKEN_EXPIRATION_TIME is not configured');
    }

    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    );

    return {
      token,
      expirationDate,
    };
  }

  async validateAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.validate(token);
  }

  async validateRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.validate(token);
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const payload = await this.validateRefreshToken(refreshToken);
    return this.generateTokens(payload);
  }
}
