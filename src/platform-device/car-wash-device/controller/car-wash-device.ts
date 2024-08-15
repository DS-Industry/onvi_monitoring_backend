import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { CreateCarWashDeviceUseCase } from '../use-cases/create-car-wash-device';
import { UpdateCarWashDeviceUseCase } from '../use-cases/update-car-wash-device';
import { GetByIdCarWashDeviceUseCase } from '../use-cases/get-by-id-car-wash-device';
import { CreateCarWashDeviceDto } from './dto/create-car-wash-device.dto';
import { UpdateCarWashDeviceDto } from './dto/update-car-wash-device.dto';

@Controller('car-wash-device')
export class CarWashDeviceController {
  constructor(
    private readonly createCarWashDeviceUseCase: CreateCarWashDeviceUseCase,
    private readonly updateCarWashDeviceUseCase: UpdateCarWashDeviceUseCase,
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
  ) {}

  @Post()
  async create(@Body() createCarWashDeviceDto: CreateCarWashDeviceDto) {
    return await this.createCarWashDeviceUseCase.execute(
      createCarWashDeviceDto,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCarWashDeviceDto: UpdateCarWashDeviceDto,
  ) {
    return await this.updateCarWashDeviceUseCase.execute(
      id,
      updateCarWashDeviceDto,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.getByIdCarWashDeviceUseCase.execute(id);
  }
}
