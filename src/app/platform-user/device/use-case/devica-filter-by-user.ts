import { Injectable } from '@nestjs/common';
import { GetAllByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-by-user';
import { GetAllPosOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-pos';
import { DeviceFilterResponseDto } from '@platform-user/device/controller/dto/device-filter-response.dto';
import { GetAllByPosCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-all-by-pos';
import { GetByIdCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-get-by-id';

@Injectable()
export class FilterDeviceByUserUseCase {
  constructor(
    private readonly getAllByUserOrganization: GetAllByUserOrganizationUseCase,
    private readonly getAllByOrganizationPos: GetAllPosOrganizationUseCase,
    private readonly getAllByPosCarWashDeviceUseCase: GetAllByPosCarWashDeviceUseCase,
    private readonly getByIdCarWashDeviceTypeUseCase: GetByIdCarWashDeviceTypeUseCase,
  ) {}

  async execute(userId: number): Promise<DeviceFilterResponseDto[]> {
    const organizations = await this.getAllByUserOrganization.execute(userId);

    const devices: DeviceFilterResponseDto[] = [];
    await Promise.all(
      organizations.map(async (organization) => {
        const organizationPos = await this.getAllByOrganizationPos.execute(
          organization.id,
        );
        await Promise.all(
          organizationPos.map(async (pos) => {
            const devicesPos =
              await this.getAllByPosCarWashDeviceUseCase.execute(pos.id);
            await Promise.all(
              devicesPos.map(async (device) => {
                const deviceType =
                  await this.getByIdCarWashDeviceTypeUseCase.execute(
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
