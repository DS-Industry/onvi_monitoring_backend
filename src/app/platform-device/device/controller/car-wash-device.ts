import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-create';
import { CarWashDeviceCreateDto } from '@platform-user/core-controller/dto/receive/car-wash-device-create.dto';
import { DeviceValidateRules } from '@platform-device/device/controller/validate/device-validate-rules';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';

@Controller('device')
export class CarWashDeviceController {
  constructor(
    private readonly createCarWashDeviceUseCase: CreateCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceValidateRules: DeviceValidateRules,
  ) {}

  @Post()
  async create(@Body() input: CarWashDeviceCreateDto) {
    await this.deviceValidateRules.createValidate(
      input.carWashDeviceTypeId,
      input.carWashPosId,
      input.name,
    );
    return await this.createCarWashDeviceUseCase.execute(input);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    await this.deviceValidateRules.getByIdValidate(id);
    return this.findMethodsCarWashDeviceUseCase.getById(id);
  }
}
