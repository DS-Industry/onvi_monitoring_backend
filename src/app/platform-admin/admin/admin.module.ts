import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { BcryptModule } from '@libs/bcrypt/module';
import { AdminController } from '@platform-admin/admin/controller/admin';
import { AdminRepositoryProvider } from '@platform-admin/admin/provider/admin';
import { CreateAdminUseCase } from '@platform-admin/admin/use-cases/admin-create';
import { GetByIdAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-id';
import { GetByEmailAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-email';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { AdminAuthModule } from '@platform-admin/auth/admin-auth.module';

@Module({
  imports: [PrismaModule, BcryptModule, AdminAuthModule],
  controllers: [AdminController],
  providers: [
    AdminRepositoryProvider,
    CreateAdminUseCase,
    GetByIdAdminUseCase,
    GetByEmailAdminUseCase,
    UpdateAdminUseCase,
  ],
  exports: [AdminRepositoryProvider],
})
export class AdminModule {}
