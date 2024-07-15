import { Module, Controller, Provider } from '@nestjs/common';
import { PrismaModule } from '../../../infra/database/prisma/prisma.module';
import { Role } from '@platform-user/user-role/controller/role';
import { RoleRepositoryProvider } from '@platform-user/user-role/provider/role';
import { CreateRoleUseCase } from '@platform-user/user-role/use-cases/role-create';
import { GetAllRoleUseCase } from '@platform-user/user-role/use-cases/role-get-all';
import { GetByIdRoleUseCase } from '@platform-user/user-role/use-cases/role-get-by-id';
import { GetByNameRoleUseCase } from '@platform-user/user-role/use-cases/role-get-by-name';
import { UpdateRoleUseCase } from '@platform-user/user-role/use-cases/role-update';
import { GetPermissionsByIdRoleUseCase } from '@platform-user/user-role/use-cases/role-get-permission-by-id';

@Module({
    imports:[PrismaModule],
    controllers:[Role],
    providers:[
        RoleRepositoryProvider, 
        CreateRoleUseCase,
        GetAllRoleUseCase,
        GetByIdRoleUseCase,
        GetByNameRoleUseCase,
        UpdateRoleUseCase,
        GetPermissionsByIdRoleUseCase,
    ],
    exports: [GetByIdRoleUseCase, GetPermissionsByIdRoleUseCase],
})

export class UserRoleModule{}