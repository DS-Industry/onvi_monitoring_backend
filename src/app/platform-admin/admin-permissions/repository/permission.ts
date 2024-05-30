import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { PrismaService } from '@db/prisma/prisma.service';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

@Injectable()
export class PermissionRepository extends IPermissionsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  create(input: AdminPermission): Promise<AdminPermission> {
    throw new Error('Method not implemented.');
  }
  update(id: number, input: AdminPermission): Promise<AdminPermission> {
    throw new Error('Method not implemented.');
  }
  remove(id: number): Promise<AdminPermission> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<AdminPermission[]> {
    const permissions = await this.prisma.platformUserPermission.findMany();

    return permissions;
  }
  findOneById(id: number): Promise<AdminPermission> {
    throw new Error('Method not implemented.');
  }
}
