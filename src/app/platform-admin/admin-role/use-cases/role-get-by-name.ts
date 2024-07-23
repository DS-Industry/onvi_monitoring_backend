import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';

@Injectable()
export class GetByNameRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(input: string) {
    const role = await this.roleRepository.findOneByName(input);
    if (!role) {
      throw new Error('role not exists');
    }
    return role;
  }
}
