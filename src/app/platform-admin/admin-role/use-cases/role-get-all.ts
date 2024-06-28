import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';
import { AdminRole } from '@platform-admin/admin-role/domain/admin-role';

@Injectable()
export class GetAllRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(): Promise<AdminRole[]> {
    return await this.roleRepository.findAll();
  }
}
