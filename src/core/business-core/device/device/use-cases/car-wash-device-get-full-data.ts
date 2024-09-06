import { Injectable } from '@nestjs/common';
import { GetByIdCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-get-by-id';
import { CarWashDevice } from '@device/device/domain/device';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';

@Injectable()
export class GetFullDataCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceTypeGetByIdUseCase: GetByIdCarWashDeviceTypeUseCase,
  ) {}

  async execute(
    carWashDevice: CarWashDevice,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    const carWashDeviceType =
      await this.carWashDeviceTypeGetByIdUseCase.execute(
        carWashDevice.carWashDeviceTypeId,
      );
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
