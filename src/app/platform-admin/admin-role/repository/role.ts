import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';
import { PrismaService } from '@db/prisma/prisma.service';
import { AdminRole } from '@platform-admin/admin-role/domain/admin-role';
import { PrismaPlatformAdminRoleMapper } from '@db/mapper/prisma-platform-admin-role-mapper';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { PrismaPlatformAdminPermissionMapper } from '@db/mapper/prisma-platform-admin-permission-mapper';

@Injectable()
export class RoleRepository extends IRoleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async create(input: AdminRole): Promise<AdminRole> {
    const adminRolePrismaEntity = PrismaPlatformAdminRoleMapper.toPrisma(input);
    const adminRole = await this.prisma.platformUserRole.create({
      data: adminRolePrismaEntity,
    });
    return PrismaPlatformAdminRoleMapper.toDomain(adminRole);
  }
  async update(id: number, input: AdminRole): Promise<AdminRole> {
    const adminRolePrismaEnriry = PrismaPlatformAdminRoleMapper.toPrisma(input);
    const adminRole = await this.prisma.platformUserRole.update({
      where: {
        id: id,
      },
      data: adminRolePrismaEnriry,
    });
    return PrismaPlatformAdminRoleMapper.toDomain(adminRole);
  }
  async remove(): Promise<AdminRole> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<AdminRole[]> {
    const permissions = await this.prisma.platformUserRole.findMany();

    return permissions.map((item) =>
      PrismaPlatformAdminRoleMapper.toDomain(item),
    );
  }
  async findOneById(id: number): Promise<AdminRole> {
    const adminRole = await this.prisma.platformUserRole.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlatformAdminRoleMapper.toDomain(adminRole);
  }

  async findOneByName(name: string): Promise<AdminRole> {
    const adminRole = await this.prisma.platformUserRole.findFirst({
      where: {
        name,
      },
    });
    return PrismaPlatformAdminRoleMapper.toDomain(adminRole);
  }

  async findAllPermissionsById(id: number): Promise<AdminPermission[]> {
    const adminRole = await this.prisma.platformUserRole.findFirst({
      where: {
        id,
      },
      include: {
        platformUserPermissions: true,
      },
    });

    return adminRole.platformUserPermissions.map((item) =>
      PrismaPlatformAdminPermissionMapper.toDomain(item),
    );
  }
}
