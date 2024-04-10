import { Module } from '@nestjs/common';
import { PlatformAdminRepository } from '../../core/modules/platform-admin/infrastructure/platformAdmin.repository';
import { PrismaModule } from '@prisma/prisma.module';
import { PlatformAdminController } from '../../core/modules/platform-admin/infrastructure/http/platformAdmin.controller';
import { PlatformAdminUseCase } from '../../core/modules/platform-admin/useCases/platformAdmin.useCase';
import { JwtModule } from '../../core/modules/services/jwt/jwt.module';
import { BcryptModule } from '../../libs/bcrypt/module';

@Module({
  imports: [PrismaModule, JwtModule, BcryptModule],
  controllers: [PlatformAdminController],
  providers: [PlatformAdminRepository, PlatformAdminUseCase],
  exports: [],
})
export class PlatformAdminModule {}
