import { Body, Controller, HttpCode, Post, Get, Param, ParseIntPipe } from "@nestjs/common";
import { CreateDevicePermissionUseCase } from '../use-cases/permission-create';
import { GetAllDevicePermissionsUseCase } from '../use-cases/permission-get-all';
import { GetDevicePermissionByIdUseCase } from '../use-cases/permission-get-by-id';
import { CreateDevicePermissionDto } from './dto/create-device-permission.dto';

@Controller('permissions')
export class DevicePermissionsController {
  constructor(
    private readonly createDevicePermissionUseCase: CreateDevicePermissionUseCase,
    private readonly getAllDevicePermissionsUseCase: GetAllDevicePermissionsUseCase,
    private readonly getDevicePermissionByIdUseCase: GetDevicePermissionByIdUseCase,
  ) {}
  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateDevicePermissionDto): Promise<any> {
    try {
      return await this.createDevicePermissionUseCase.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get()
  async getAll(): Promise<any> {
    try {
      return await this.getAllDevicePermissionsUseCase.execute();
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.getDevicePermissionByIdUseCase.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
