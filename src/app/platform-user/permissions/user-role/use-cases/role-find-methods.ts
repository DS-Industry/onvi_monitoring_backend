import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/permissions/user-role/interfaces/role';
import { UserRole } from '@platform-user/permissions/user-role/domain/user-role';
import { UserPermission } from '@platform-user/permissions/user-permissions/domain/user-permissions';

@Injectable()
export class FindMethodsRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async getAll(): Promise<UserRole[]> {
    return await this.roleRepository.findAll();
  }

  async getById(input: number) {
    return await this.roleRepository.findOneById(input);
  }

  async getByName(input: string) {
    return await this.roleRepository.findOneByName(input);
  }

  async getPermissionsById(input: number): Promise<UserPermission[]> {
    return await this.roleRepository.findAllPermissionsById(input);
  }
}
