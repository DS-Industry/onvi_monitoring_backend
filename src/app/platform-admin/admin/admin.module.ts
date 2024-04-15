import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { BcryptModule } from '@libs/bcrypt/module';
import { AdminController } from '@platform-admin/admin/controller/admin';
import { AdminRepositoryProvider } from '@platform-admin/admin/provider/admin';
import { CreateAdminUseCase } from '@platform-admin/admin/use-cases/admin-create';
import { GetByIdAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-id';
import { AdminRepository } from '@platform-admin/admin/repository/admin';
import { GetByEmailAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-email';

@Module({
  imports: [PrismaModule, BcryptModule],
  controllers: [AdminController],
  providers: [
    AdminRepositoryProvider,
    AdminRepository,
    CreateAdminUseCase,
    GetByIdAdminUseCase,
    GetByEmailAdminUseCase,
  ],
  exports: [AdminRepositoryProvider],
})
export class AdminModule {}
