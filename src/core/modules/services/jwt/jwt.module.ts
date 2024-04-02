import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtProvider } from './jwt.provider';
import { IJwtService } from '../../../common/interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Jwt.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwtExpirationTime'),
        },
      }),
    }),
  ],
  providers: [JwtProvider],
  exports: [IJwtService],
})
export class JwtModule {}
