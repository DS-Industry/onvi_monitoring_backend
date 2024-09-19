import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { DeviceDataRaw } from '@device/device-data-raw/domain/device-data-raw';
import { DeviceDataRawCreateDto } from '@platform-device/device-data-raw/controller/dto/device-data-raw-create.dto';
import { CreateDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-create';
import { GetAllByStatusDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-get-all-by-status';
import { StatusDeviceDataRaw } from '@prisma/client';
import { ApiKeyAuthGuard } from '@platform-device/device-data-raw/guards/api-key.guards';

@Controller('data/raw')
export class DeviceDataRawController {
  constructor(
    private readonly deviceDataRawCreate: CreateDeviceDataRawUseCase,
    private readonly deviceDataRawGetAllByStatus: GetAllByStatusDeviceDataRawUseCase,
  ) {}

  @Post('')
  //@UseGuards(ApiKeyAuthGuard)
  @HttpCode(201)
  async create(@Body() data: DeviceDataRawCreateDto): Promise<void> {
    try {
      await this.deviceDataRawCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('new')
  @HttpCode(201)
  async getAllByStatus(): Promise<DeviceDataRaw[]> {
    try {
      return await this.deviceDataRawGetAllByStatus.execute(
        StatusDeviceDataRaw.NEW,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
