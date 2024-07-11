import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IPermissionsRepository } from '@platform-user/user-permissions/interfaces/permissions';
import { UserPermission } from '@platform-user/user-permissions/domain/user-permission';
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
        const permission = await this.prisma.platformUserPermission.create({
          data: {
            ...permissionPrismaEntity,
            platformUserRoles: {
              connect: roles,
            },
          },
        });
        return PrismaPlatformUserPermissionMapper.toDomain(permission);
      }    

      async update(id: number, input: UserPermission): Promise<UserPermission> {
        const permissionPrismaEntity =
        PrismaPlatformUserPermissionMapper.toPrisma(input);
        const permission = await this.prisma.platformUserPermission.update({
          where: {
            id: id,
          },
          data: permissionPrismaEntity,
        });
        return PrismaPlatformUserPermissionMapper.toDomain(permission);
      }

      async remove(id: number): Promise<UserPermission> {
        throw new Error('Method not implemented.');
      }
      async findAll(): Promise<UserPermission[]> {
        const permissions = await this.prisma.platformUserPermission.findMany();
        return permissions.map((item) =>
        PrismaPlatformUserPermissionMapper.toDomain(item),
        );
      }
      async findOneById(id: number): Promise<UserPermission> {
        const permission = await this.prisma.platformUserPermission.findFirst({
          where: {
            id,
          },
        });
        return PrismaPlatformUserPermissionMapper.toDomain(permission);
      }
}
