import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreatePermissionsUseCase } from '@platform-admin/admin-permissions/use-cases/permissions-create';
import { CreatePermissionsDto } from '@platform-admin/admin-permissions/controller/dto/permissions-create.dto';

@Controller('permission')
export class Permissions {
  constructor(private readonly permissionCreate: CreatePermissionsUseCase) {}

  @Post('')
  @HttpCode(201)
  async create(@Body() data: CreatePermissionsDto): Promise<any> {
    try {
      return this.permissionCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}
