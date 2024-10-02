import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@pos/device/device/interfaces/device';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { CarWashDeviceCreateDto } from '@pos/device/device/use-cases/dto/car-wash-device-create.dto';

@Injectable()
export class CreateCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
  ) {}

  async execute(
    input: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    const carWashDeviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(
        input.carWashDeviceTypeId,
      );

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
