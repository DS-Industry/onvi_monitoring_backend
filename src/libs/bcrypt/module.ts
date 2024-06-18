import { Module } from '@nestjs/common';
import { IBcryptAdapter } from './adapter';
import { BcryptService } from './service';

@Module({
  imports: [],
  providers: [
    {
      provide: IBcryptAdapter,
      useFactory: () => new BcryptService(),
    },
  ],
  exports: [IBcryptAdapter],
})
export class BcryptModule {}
