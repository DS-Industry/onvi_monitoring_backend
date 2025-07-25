import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-create';
import { DeviceValidateRules } from '@platform-device/validate/validate-rules/device-validate-rules';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';

@Controller('')
export class CarWashDeviceController {
  constructor(
    private readonly createCarWashDeviceUseCase: CreateCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceValidateRules: DeviceValidateRules,
  ) {}

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    await this.deviceValidateRules.getByIdValidate(id);
    return this.findMethodsCarWashDeviceUseCase.getById(id);
  }
}
