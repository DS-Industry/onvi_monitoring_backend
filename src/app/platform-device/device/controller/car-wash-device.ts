import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';

@Controller('device')
export class CarWashDeviceController {
  constructor(
    private readonly createCarWashDeviceUseCase: CreateCarWashDeviceUseCase,
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
  ) {}

  @Post()
  async create(@Body() input: CarWashDeviceCreateDto) {
    return await this.createCarWashDeviceUseCase.execute(input);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.getByIdCarWashDeviceUseCase.execute(id);
  }
}
