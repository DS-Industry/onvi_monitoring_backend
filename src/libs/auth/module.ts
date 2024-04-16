import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { IJwtAdapter } from '@libs/auth/adapter';
import { JwtTokenService } from '@libs/auth/service';

@Module({
  imports: [
    Jwt.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
    }),
  ],
  providers: [
    {
      provide: IJwtAdapter,
      useClass: JwtTokenService,
    },
  ],
  exports: [IJwtAdapter],
})
export class JwtModule {}
