import {
  Controller,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common';
import { CreateDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-create';
import { ApiKeyAuthGuard } from '@platform-device/device-data-raw/guards/api-key.guards';

@Controller('data/raw')
export class DeviceDataRawController {
  constructor(
    private readonly deviceDataRawCreate: CreateDeviceDataRawUseCase,
  ) {}

  @Post('')
  //@UseGuards(ApiKeyAuthGuard)
  @HttpCode(201)
  async create(@Request() req: any): Promise<void> {
    try {
      const data = req.headers.data;
      await this.deviceDataRawCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}
