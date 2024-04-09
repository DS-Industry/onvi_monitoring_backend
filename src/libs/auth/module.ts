import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';


@Module({
  imports: [Jwt.register({})],
  providers: [],
  exports: [],
})
export class JwtModule {}
