import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { PrismaService } from '@db/prisma/prisma.service';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { PrismaPlatformAdminPermissionMapper } from '@db/mapper/prisma-platform-admin-permission-mapper';

@Injectable()
export class PermissionRepository extends IPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async create(
    input: AdminPermission,
    roles: { id: number }[],
  ): Promise<AdminPermission> {
    const permissionPrismaEntity =
      PrismaPlatformAdminPermissionMapper.toPrisma(input);
    const permission = await this.prisma.platformUserPermission.create({
      data: {
        ...permissionPrismaEntity,
        platformUserRoles: {
          connect: roles,
        },
      },
    });
    return PrismaPlatformAdminPermissionMapper.toDomain(permission);
  }


  async update(id: number, input: AdminPermission): Promise<AdminPermission> {
    const permissionPrismaEntity =
      PrismaPlatformAdminPermissionMapper.toPrisma(input);
    const permission = await this.prisma.platformUserPermission.update({
      where: {
        id: id,
      },
      data: permissionPrismaEntity,
    });
    return PrismaPlatformAdminPermissionMapper.toDomain(permission);
  }

  
  async remove(id: number): Promise<AdminPermission> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<AdminPermission[]> {
    const permissions = await this.prisma.platformUserPermission.findMany();
    return permissions.map((item) =>
      PrismaPlatformAdminPermissionMapper.toDomain(item),
    );
  }
  async findOneById(id: number): Promise<AdminPermission> {
    const permission = await this.prisma.platformUserPermission.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlatformAdminPermissionMapper.toDomain(permission);
  }
}
