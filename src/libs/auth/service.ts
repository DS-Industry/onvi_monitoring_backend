import { IJwtAdapter } from './adapter';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService implements IJwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
  signToken(model: any, secret: string, expiresIn: string): string {
    return this.jwtService.sign(model, {
      secret,
      expiresIn,
    });
  }

  async validate(token: string, secret?: string): Promise<any> {
    if (secret) {
      return await this.jwtService.verifyAsync(token, { secret });
    }
    return await this.jwtService.verifyAsync(token);
  }
}
