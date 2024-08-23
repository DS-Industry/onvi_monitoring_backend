import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '../interfaces/car-wash-device';
import { CarWashDevice } from '../domain/car-wash-device';
import { UpdateCarWashDeviceDto } from '../controller/dto/update-car-wash-device.dto';

@Injectable()
export class UpdateCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async execute(
    id: number,
    input: UpdateCarWashDeviceDto,
  ): Promise<CarWashDevice> {
    const existingDevice = await this.carWashDeviceRepository.findOneById(id);
    if (!existingDevice) {
      throw new Error('CarWashDevice not found');
    }

    existingDevice.name = input.name;
    existingDevice.carWashDeviceMetaData = input.carWashDeviceMetaData;
    existingDevice.status = input.status;
    existingDevice.ipAddress = input.ipAddress;
    existingDevice.carWashDeviceTypeId = input.carWashDeviceTypeId;
    existingDevice.deviceRoleId = input.deviceRoleId;

    return await this.carWashDeviceRepository.update(id, existingDevice);
  }
}
