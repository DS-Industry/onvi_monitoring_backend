import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeviceApiKeyUseCase } from '../user-cases/create-api-key';
import { FindDeviceApiKeysByKeyUseCase } from '../user-cases/api-get-by-id';
import { CreateDeviceApiKeyDto } from './dto/create-api-key-dto';
import { FindDeviceApiKeysByKeyDto } from './dto/find-api-key-dto';

@Controller('deviceapikey')
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
