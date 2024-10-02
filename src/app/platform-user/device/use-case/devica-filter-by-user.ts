import { Injectable } from '@nestjs/common';
import { DeviceFilterResponseDto } from '@platform-user/device/controller/dto/device-filter-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";

@Injectable()
export class FilterDeviceByUserUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
  ) {}

  async execute(userId: number): Promise<DeviceFilterResponseDto[]> {
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByUser(userId);

    const devices: DeviceFilterResponseDto[] = [];
    await Promise.all(
      organizations.map(async (organization) => {
        const organizationPos =
          await this.findMethodsOrganizationUseCase.getAllPos(organization.id);
        await Promise.all(
          organizationPos.map(async (pos) => {
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
      }),
    );
    return devices;
  }
}
