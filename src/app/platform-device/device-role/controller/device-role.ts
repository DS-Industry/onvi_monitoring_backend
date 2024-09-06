import { Controller, Get, Param, HttpCode } from '@nestjs/common';
import { GetDeviceRoleByIdUseCase } from '../use-cases/device-role-get-by-id';
import { GetPermissionsByRoleIdUseCase } from '../use-cases/device-role-get-permission-by-id';

@Controller('role')
export class DeviceRoleController {
  constructor(
    private readonly getDeviceRoleByIdUseCase: GetDeviceRoleByIdUseCase,
    private readonly getPermissionsByRoleIdUseCase: GetPermissionsByRoleIdUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: number): Promise<any> {
    return this.getDeviceRoleByIdUseCase.execute(id);
  }

  @Get(':id/permissions')
  @HttpCode(200)
  async getPermissionsByRoleId(@Param('id') id: number): Promise<any> {
    return this.getPermissionsByRoleIdUseCase.execute(id);
  }
}
