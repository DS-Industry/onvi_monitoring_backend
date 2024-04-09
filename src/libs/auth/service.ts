import { IJwtAdapter } from './adapter';
import { JwtService as Jwt } from '@nestjs/jwt';

export class JwtService implements IJwtAdapter {
  constructor(private readonly jwt: Jwt) {}
  signToken(model: any, secret: string, expiresIn: string): string {
    return this.jwt.sign(model, {
      secret,
      expiresIn,
    });
  }

  async validate(token: string): Promise<any> {
    return await this.jwt.verifyAsync(token);
  }
}
