import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [],
})
export class AdminPermissionsModule {}
