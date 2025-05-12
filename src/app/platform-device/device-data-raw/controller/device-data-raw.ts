import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { CreateDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-create';
import { ApiKeyAuthGuard } from '@platform-device/device-data-raw/guards/api-key.guards';

@Controller('data')
export class DeviceDataRawController {
  constructor(
    private readonly deviceDataRawCreate: CreateDeviceDataRawUseCase,
  ) {}

  @Post('raw')
  @UseGuards(ApiKeyAuthGuard)
  @HttpCode(200)
  async create(@Request() req: any): Promise<any> {
    try {
      const dataReq = req.headers.data;
      const data = dataReq.substring(1, dataReq.length - 1);
      await this.deviceDataRawCreate.execute(data);
      return { status: 200 };
    } catch (e) {
      throw new Error(e);
    }
  }
}
