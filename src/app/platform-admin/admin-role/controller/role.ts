import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateRoleUseCase } from '@platform-admin/admin-role/use-cases/role-create';
import { GetByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-by-id';
import { CreateRoleDto } from '@platform-admin/admin-role/controller/dto/role-create.dto';
import { GetPermissionsByIdRoleUseCase } from '@platform-admin/admin-role/use-cases/role-get-permissions-by-id';

@Controller('role')
export class Role {
  constructor(
    private readonly roleCreate: CreateRoleUseCase,
    private readonly roleGetById: GetByIdRoleUseCase,
    private readonly rolePermissionsById: GetPermissionsByIdRoleUseCase,
  ) {}

  @Post('')
  @HttpCode(201)
  async create(@Body() data: CreateRoleDto): Promise<any> {
    try {
      return this.roleCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('permissions/:id')
  @HttpCode(200)
  async getRolePermissionsById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.rolePermissionsById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
