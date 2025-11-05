import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IPosService } from './interface/pos.interface';
import { PosService } from './pos.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: IPosService,
      useClass: PosService,
    },
  ],
  exports: [IPosService],
})
export class PosModule {}
