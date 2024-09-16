import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceApiKeyUseCase } from '@platform-device/auth/use-cases/create-api-key';
import { FindDeviceApiKeysByKeyUseCase } from '@platform-device/auth/use-cases/api-get-by-id';
import { CreateDeviceApiKeyDto } from './dto/create-api-key-dto';

@Controller('auth')
export class DeviceApiKeyController {
  constructor(
    private readonly createDeviceApiKeyUseCase: CreateDeviceApiKeyUseCase,
    private readonly findDeviceApiKeysByKeyUseCase: FindDeviceApiKeysByKeyUseCase,
  ) {}

  @Post()
  async create(@Body() createDeviceApiKeyDto: CreateDeviceApiKeyDto) {
    return await this.createDeviceApiKeyUseCase.execute(createDeviceApiKeyDto);
  }

  @Get(':key')
  @HttpCode(200)
  async findByKey(@Param('key') key: string) {
    const deviceApiKey = await this.findDeviceApiKeysByKeyUseCase.execute(key);
    if (!deviceApiKey) {
      throw new NotFoundException('Device API key not found');
    }
    return deviceApiKey;
  }
}
