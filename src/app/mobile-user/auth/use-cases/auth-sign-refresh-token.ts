import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtAdapter } from '@libs/auth/adapter';
import { TokenPayload } from '@mobile-user/auth/domain/jwt-payload';
import ms = require('ms');

@Injectable()
export class SignRefreshTokenUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: IJwtAdapter,
  ) {}

  async execute(
    phone: string,
    id: number,
  ): Promise<any> {
    const payload: TokenPayload = { phone: phone, clientId: id };
    const secret = this.configService.get<string>('jwtRefreshTokenSecret');
    const expiresIn = this.configService.get<string>(
      'jwtRefreshTokenExpiration',
    );
    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    ).toISOString();

    return { token, expirationDate };
  }
}
