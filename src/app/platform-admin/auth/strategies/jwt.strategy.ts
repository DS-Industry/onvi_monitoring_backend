import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@platform-admin/auth/domain/jwt-payload';
import { ValidateAdminForJwtStrategyUseCase } from '@platform-admin/auth/use-cases/auth-validate-jwt-strategy';
import { Admin } from '@platform-admin/admin/domain/admin';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'adminJwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateJwtStrategyUseCase: ValidateAdminForJwtStrategyUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<Admin> {
    try {
      return await this.validateJwtStrategyUseCase.execute(payload.email);
    } catch (e) {
      throw new Error('error');
    }
  }
}
