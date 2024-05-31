import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';
import { UpdateRoleDto } from '@platform-admin/admin-role/use-cases/dto/role-update.dto';

@Injectable()
export class UpdateRoleUseCase {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(input: UpdateRoleDto) {
    const role = await this.roleRepository.findOneById(input.id);
    if (!role) {
      throw new Error('role not exists');
    }
    const { name } = input;

    role.name = name ? name : role.name;

    return await this.roleRepository.update(role.id, role);
  }
}
