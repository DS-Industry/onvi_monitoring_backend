import { Injectable } from '@nestjs/common';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';
import { GetByIdCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-get-by-id';

@Injectable()
export class PreCreateDeviceUseCase {
  constructor(
    private readonly deviceCreateCarWashDevice: CreateCarWashDeviceUseCase,
    private readonly carWashPosGetById: GetByIdCarWashPosUseCase,
  ) {}

  async execute(
    input: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    const carWashPos = await this.carWashPosGetById.execute(input.carWashPosId);
    if (!carWashPos) {
      throw new Error('car wash pos exists');
    }
    return await this.deviceCreateCarWashDevice.execute(input);
  }
}
