import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { CreateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-create';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';
import { DeviceTypeCreateDto } from '@platform-user/device/controller/dto/device-type-create.dto';
import { UpdateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-update';
import { DeviceTypeUpdateDto } from '@platform-user/device/controller/dto/device-type-update.dto';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';
import { PreCreateDeviceUseCase } from '@platform-user/device/use-case/device-pre-create';

@Controller('device')
export class DeviceController {
  constructor(
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly carWashDevicePreCreate: PreCreateDeviceUseCase,
  ) {}

  @Post('')
  @HttpCode(201)
  async create(
    @Body() data: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    try {
      return await this.carWashDevicePreCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('type')
  @HttpCode(201)
  async createType(
    @Body() data: DeviceTypeCreateDto,
  ): Promise<CarWashDeviceType> {
    try {
      return await this.carWashDeviceTypeCreate.execute(data.name, data.code);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('type')
  @HttpCode(201)
  async updateType(
    @Body() data: DeviceTypeUpdateDto,
  ): Promise<CarWashDeviceType> {
    try {
      return await this.carWashDeviceTypeUpdate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}
