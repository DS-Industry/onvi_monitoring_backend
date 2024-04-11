import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}
