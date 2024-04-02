import { Module } from '@nestjs/common';
import { PrismaUseCase } from './prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaUseCase],
  exports: [PrismaUseCase],
})
export class PrismaModule {}
