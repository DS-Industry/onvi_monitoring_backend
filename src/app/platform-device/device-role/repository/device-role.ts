import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IDeviceRoleRepository } from '../interfaces/role';
import { DeviceRole } from '../domain/device-role';
import { PrismaDeviceRoleMapper } from '@db/mapper/prisma-device-role-mapper';

@Injectable()
export class DeviceRoleRepository extends IDeviceRoleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOneById(id: number): Promise<DeviceRole> {
    const role = await this.prisma.deviceRole.findUnique({
      where: { id },
      include: { devicePermissions: true },
    });
    return PrismaDeviceRoleMapper.toDomain(role);
  }

  async findAllPermissionsByRoleId(roleId: number): Promise<DeviceRole> {
    const role = await this.prisma.deviceRole.findUnique({
      where: { id: roleId },
      include: { devicePermissions: true },
    });
    return PrismaDeviceRoleMapper.toDomain(role);
  }
}
