import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';

@Injectable()
export class GetByIdRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(input: number) {
    const role = await this.roleRepository.findOneById(input);
    if (!role) {
      throw new Error('role not exists');
    }
    return role;
  }
}
