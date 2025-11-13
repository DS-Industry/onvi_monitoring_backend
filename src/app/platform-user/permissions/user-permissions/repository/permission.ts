import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IPermissionsRepository } from '@platform-user/permissions/user-permissions/interfaces/permissions';
import { UserPermission } from '@platform-user/permissions/user-permissions/domain/user-permissions';
import { PrismaPlatformUserPermissionMapper } from '@db/mapper/prisma-platform-user-permission-mapper';

@Injectable()
export class PermissionRepository extends IPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async create(
    input: UserPermission,
    roles: { id: number }[],
  ): Promise<UserPermission> {
    const permissionPrismaEntity =
      PrismaPlatformUserPermissionMapper.toPrisma(input);
    const permission = await this.prisma.userPermission.create({
      data: {
        ...permissionPrismaEntity,
        userRoles: {
          connect: roles,
        },
      },
    });
    return PrismaPlatformUserPermissionMapper.toDomain(permission);
  }

  async update(id: number, input: UserPermission): Promise<UserPermission> {
    const permissionPrismaEntity =
      PrismaPlatformUserPermissionMapper.toPrisma(input);
    const permission = await this.prisma.userPermission.update({
      where: {
        id: id,
      },
      data: permissionPrismaEntity,
    });
    return PrismaPlatformUserPermissionMapper.toDomain(permission);
  }

  async remove(): Promise<UserPermission> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<UserPermission[]> {
    const permissions = await this.prisma.userPermission.findMany();
    return permissions.map((item) =>
      PrismaPlatformUserPermissionMapper.toDomain(item),
    );
  }
  async findOneById(id: number): Promise<UserPermission> {
    const permission = await this.prisma.userPermission.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlatformUserPermissionMapper.toDomain(permission);
  }
}
