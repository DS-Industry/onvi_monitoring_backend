import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PermissionsRepositoryProvider } from '@platform-admin/admin-permissions/provider/permissions';
import { CreatePermissionsUseCase } from '@platform-admin/admin-permissions/use-cases/permissions-create';
import { GetAllPermissionsUseCases } from '@platform-admin/admin-permissions/use-cases/permissions-get-all';
import { GetByIdPermissionsUseCase } from '@platform-admin/admin-permissions/use-cases/permissions-get-by-id';
import { UpdatePermissionsUseCase } from '@platform-admin/admin-permissions/use-cases/permissions-update';

@Module({
  imports: [PrismaModule],
  providers: [
    PermissionsRepositoryProvider,
    CreatePermissionsUseCase,
    GetAllPermissionsUseCases,
    GetByIdPermissionsUseCase,
    UpdatePermissionsUseCase,
  ],
  exports: [],
})
export class AdminPermissionsModule {}
