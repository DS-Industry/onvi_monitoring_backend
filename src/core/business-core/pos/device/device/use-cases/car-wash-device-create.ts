import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@pos/device/device/interfaces/device';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/core-controller/dto/response/car-wash-device-full-data-response.dto';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CarWashDeviceCreateDto } from '@pos/device/device/use-cases/dto/car-wash-device-create.dto';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';

@Injectable()
export class CreateCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {}

  async execute(
    input: CarWashDeviceCreateDto,
    carWashDeviceType: CarWashDeviceType,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    const carWashDeviceData = new CarWashDevice({
      name: input.name,
      carWashDeviceMetaData: input.carWashDeviceMetaData,
      status: input.status,
      ipAddress: input.ipAddress,
      carWashDeviceTypeId: carWashDeviceType.id,
      carWashPosId: input.carWashPosId,
      deviceRoleId: input.deviceRoleId,
    });

    const carWashDevice =
      await this.carWashDeviceRepository.create(carWashDeviceData);
    return {
      id: carWashDevice.id,
      name: carWashDevice.name,
      carWashDeviceMetaData: carWashDevice.carWashDeviceMetaData,
      status: carWashDevice.status,
      ipAddress: carWashDevice.ipAddress,
      carWashPosId: carWashDevice.carWashPosId,
      deviceRoleId: carWashDevice.deviceRoleId,
      deviceType: {
        name: carWashDeviceType.name,
        code: carWashDeviceType.code,
      },
    };
  }
}
