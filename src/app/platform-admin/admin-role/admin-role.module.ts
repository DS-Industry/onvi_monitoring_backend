import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { RoleRepositoryProvider } from "@platform-admin/admin-role/provider/role";
import { CreateRoleUseCase } from "@platform-admin/admin-role/use-cases/role-create";
import { GetAllRoleUseCase } from "@platform-admin/admin-role/use-cases/role-get-all";
import { GetByIdRoleUseCase } from "@platform-admin/admin-role/use-cases/role-get-by-id";
import { GetByNameRoleUseCase } from "@platform-admin/admin-role/use-cases/role-get-by-name";
import { UpdateRoleUseCase } from "@platform-admin/admin-role/use-cases/role-update";

@Module({
  imports: [PrismaModule],
  providers: [
    RoleRepositoryProvider,
    CreateRoleUseCase,
    GetAllRoleUseCase,
    GetByIdRoleUseCase,
    GetByNameRoleUseCase,
    UpdateRoleUseCase,
  ],
  exports: [],
})
export class AdminRoleModule {}
