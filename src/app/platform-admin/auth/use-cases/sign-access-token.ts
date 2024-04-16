import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { TokenPayload } from '@platform-admin/auth/domain/jwt-payload';
import { IJwtAdapter } from '@libs/auth/adapter';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class SignAccessTokenUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: IJwtAdapter,
  ) {}

  async execute(
    email: string,
    id: number,
  ): Promise<{ token: string; expirationDate: string }> {
    const payload: TokenPayload = { email: email, id: id };
    const secret = this.configService.get<string>('jwtSecret');
    const expiresIn = this.configService.get<string>('jwtExpirationTime');
    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    ).toISOString();
    return { token, expirationDate };
  }
}
