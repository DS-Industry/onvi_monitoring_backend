import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/user-role/interfaces/role';
import { PrismaService } from '@db/prisma/prisma.service';
import { UserRole } from '@platform-user/user-role/domain/user-role';
import { PrismaPlatformUserRoleMapper } from '@db/mapper/prisma-platform-user-role-mapper';
import { UserPermission } from '@platform-user/user-permissions/domain/user-permission';
import { PrismaPlatformUserPermissionMapper } from '@db/mapper/prisma-platform-user-permission-mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository extends IRoleRepository {
    constructor(private readonly prisma:PrismaService){
     super()
    }
    async create(input: UserRole): Promise<UserRole> {
        const userRolePrismaEntity = PrismaPlatformUserPermissionMapper.toPrisma(input);
        const userRole = await this.prisma.platformUserRole.create({
          data: userRolePrismaEntity,
        });
        return PrismaPlatformUserPermissionMapper.toDomain(userRole);
      }

      async update(id: number, input: UserRole): Promise<UserRole> {
        const userRolePrismaEntity = PrismaPlatformUserPermissionMapper.toPrisma(input);
        const userRole = await this.prisma.platformUserRole.update({
          where: {
            id: id,
          },
          data: userRolePrismaEntity,
        });
        return PrismaPlatformUserPermissionMapper.toDomain(userRole);
      }
      async remove(id: number): Promise<UserRole> {
        throw new Error('Method not implemented.');
      }
      async findAll(): Promise<UserRole[]> {
        const permissions = await this.prisma.platformUserRole.findMany();
        return permissions.map((item) =>
        PrismaPlatformUserPermissionMapper.toDomain(item),
        );
      }
      async findOneById(id: number): Promise<UserRole> {
        const userRole = await this.prisma.platformUserRole.findFirst({
          where: {
            id,
          },
        });
        return PrismaPlatformUserPermissionMapper.toDomain(userRole);
      }
      async findOneByName(name: string): Promise<UserRole> {
        const userRole = await this.prisma.platformUserRole.findFirst({
          where: {
            name,
          },
        });
        return PrismaPlatformUserPermissionMapper.toDomain(userRole);
      }
    
      async findAllPermissionsById(id: number): Promise<UserPermission[]> {
        const userRole = await this.prisma.platformUserRole.findFirst({
          where: {
            id,
          },
          include: {
            platformUserPermissions: true,
          },
        });
    
        return userRole.platformUserPermissions.map((item) =>
        PrismaPlatformUserPermissionMapper.toDomain(item),
        );
      }
}

