import {
  Controller,
  Get,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { GetDeviceObjectByIdUseCase } from '../use-cases/device-object-get-by-id';

@Controller('deviceobjects')
export class DeviceObjectController {
  constructor(
    private readonly getDeviceObjectByIdUseCase: GetDeviceObjectByIdUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id') id: number) {
    const deviceObject = await this.getDeviceObjectByIdUseCase.execute(id);
    if (!deviceObject) {
      throw new NotFoundException('Device Object not found');
    }
    return deviceObject;
  }
}
