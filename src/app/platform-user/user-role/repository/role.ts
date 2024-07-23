import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/user-role/interfaces/role';
import { PrismaService } from '@db/prisma/prisma.service';
import { UserRole } from '@platform-user/user-role/domain/user-role';
import { PrismaUserRoleMapper } from '@db/mapper/prisma-platform-user-role-mapper';
import { UserPermission } from '@platform-user/user-permissions/domain/user-permissions';
import { PrismaPlatformUserPermissionMapper } from '@db/mapper/prisma-platform-user-permission-mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleRepository extends IRoleRepository {
    constructor(private readonly prisma:PrismaService){
     super()
    }
    async create(input: UserRole): Promise<UserRole> {
        const userRolePrismaEntity = PrismaUserRoleMapper.toPrisma(input);
        const userRole = await this.prisma.userRole.create({
          data: userRolePrismaEntity,
        });
        return PrismaUserRoleMapper.toDomain(userRole);
      }

      async update(id: number, input: UserRole): Promise<UserRole> {
        const userRolePrismaEntity = PrismaUserRoleMapper.toPrisma(input);
        const userRole = await this.prisma.userRole.update({
          where: {
            id: id,
          },
          data: userRolePrismaEntity,
        });
        return PrismaUserRoleMapper.toDomain(userRole);
      }
      async remove(id: number): Promise<UserRole> {
        throw new Error('Method not implemented.');
      }
      async findAll(): Promise<UserRole[]> {
        const permissions = await this.prisma.userRole.findMany();
        return permissions.map((item) =>
        PrismaUserRoleMapper.toDomain(item),
        );
      }
      async findOneById(id: number): Promise<UserRole> {
        const userRole = await this.prisma.userRole.findFirst({
          where: {
            id,
          },
        });
        return PrismaUserRoleMapper.toDomain(userRole);
      }
      async findOneByName(name: string): Promise<UserRole> {
        const userRole = await this.prisma.userRole.findFirst({
          where: {
            name,
          },
        });
        return PrismaUserRoleMapper.toDomain(userRole);
      }
    
      async findAllPermissionsById(id: number): Promise<UserPermission[]> {
        const userRole = await this.prisma.userRole.findFirst({
          where: {
            id,
          },
          include: {
            userPermissions: true,
          },
        });
    
        return userRole.userPermissions.map((item) =>
        PrismaPlatformUserPermissionMapper.toDomain(item),
        );
      }
}

