import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@platform-user/auth/domain/jwt-payload';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'user-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwtRefreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    try {
      const refreshToken = request.body['refreshToken'];
      const user = await this.userRepository.findOneByEmail(payload.email);
      if (!user) {
        throw new Error('email not exists');
      }

      const isRefreshingTokenMatching = await this.bcrypt.compare(
        refreshToken,
        user.refreshTokenId,
      );

      if (isRefreshingTokenMatching) {
        return user;
      }
    } catch (e) {
      throw new Error('error');
    }
  }
}
