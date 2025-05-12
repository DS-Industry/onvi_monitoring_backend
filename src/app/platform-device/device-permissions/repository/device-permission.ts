import { Injectable } from '@nestjs/common';
import { IDevicePermissionsRepository } from '../interfaces/device-permission';
import { PrismaService } from '@db/prisma/prisma.service';
import { DevicePermission } from '../domain/device-permission';
import { PrismaDevicePermissionMapper } from '@db/mapper/prisma-device-permission-mapper';

@Injectable()
export class DevicePermissionsRepository extends IDevicePermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async create(
    input: DevicePermission,
    roles: { id: number }[],
  ): Promise<DevicePermission> {
    const permissionPrismaEntity = PrismaDevicePermissionMapper.toPrisma(input);
    const permission = await this.prisma.devicePermissions.create({
      data: {
        ...permissionPrismaEntity,
        DeviceRole: {
          connect: roles.map((role) => ({ id: role.id })),
        },
      },
    });
    return PrismaDevicePermissionMapper.toDomain(permission);
  }

  async update(id: number, input: DevicePermission): Promise<DevicePermission> {
    const permissionPrismaEntity = PrismaDevicePermissionMapper.toPrisma(input);
    const permission = await this.prisma.devicePermissions.update({
      where: { id },
      data: permissionPrismaEntity,
    });
    return PrismaDevicePermissionMapper.toDomain(permission);
  }

  async remove(id: number): Promise<DevicePermission> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<DevicePermission[]> {
    const permissions = await this.prisma.devicePermissions.findMany();
    return permissions.map((item) =>
      PrismaDevicePermissionMapper.toDomain(item),
    );
  }

  async findOneById(id: number): Promise<DevicePermission> {
    const permission = await this.prisma.devicePermissions.findFirst({
      where: { id },
    });
    return PrismaDevicePermissionMapper.toDomain(permission);
  }
}
