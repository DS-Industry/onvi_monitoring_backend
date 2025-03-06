import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { DeviceFilterResponseDto } from '@platform-user/core-controller/dto/response/device-filter-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class DataByPermissionCarWashDeviceUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
  ) {}

  async execute(
    ability: any,
    placementId: number | '*',
  ): Promise<DeviceFilterResponseDto[]> {
    const devices: DeviceFilterResponseDto[] = [];
    const poses = await this.findMethodsPosUseCase.getAllByAbility(
      ability,
      placementId,
    );
    await Promise.all(
      poses.map(async (pos) => {
        const devicesPos =
          await this.findMethodsCarWashDeviceUseCase.getAllByPos(pos.id);
        await Promise.all(
          devicesPos.map(async (device) => {
            const deviceType =
              await this.findMethodsCarWashDeviceTypeUseCase.getById(
                device.carWashDeviceTypeId,
              );
            devices.push({
              id: device.id,
              name: device.name,
              status: device.status,
              ipAddress: device.ipAddress,
              carWashDeviceType: deviceType.name,
              carWashPosName: pos.name,
              carWashPosId: pos.id,
            });
          }),
        );
      }),
    );
    return devices;
  }
}
