import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PermissionsRepositoryProvider } from '@platform-user/user-permissions/provider/permissions';
import { GetAllPermissionsUseCases } from '@platform-user/user-permissions/use-cases/permissions-get-all';
import { GetByIdPermissionsUseCase } from '@platform-user/user-permissions/use-cases/permissions-get-by-id';

@Module({
    imports: [PrismaModule],
    providers: [
      PermissionsRepositoryProvider,
      GetAllPermissionsUseCases,
      GetByIdPermissionsUseCase,
    ],
    exports: [],
  })
  export class UserPermissionsModule {}
  