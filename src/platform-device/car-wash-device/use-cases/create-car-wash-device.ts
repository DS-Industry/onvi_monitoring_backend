// src/app/device/use-cases/create-car-wash-device.ts
import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '../interfaces/car-wash-device';
import { CarWashDevice } from '../domain/car-wash-device';
import { CreateCarWashDeviceDto } from '../controller/dto/create-car-wash-device.dto';

@Injectable()
export class CreateCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async execute(input: CreateCarWashDeviceDto): Promise<CarWashDevice> {
    const carWashDevice = new CarWashDevice({
      name: input.name,
      carWashDeviceMetaData: input.carWashDeviceMetaData,
      status: input.status,
      ipAddress: input.ipAddress,
      carWashDeviceTypeId: input.carWashDeviceTypeId,
      deviceRoleId: input.deviceRoleId,
    });

    return await this.carWashDeviceRepository.create(carWashDevice);
  }
}
