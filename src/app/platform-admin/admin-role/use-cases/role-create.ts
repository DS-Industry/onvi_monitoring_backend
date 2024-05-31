import { Injectable } from "@nestjs/common";
import { IRoleRepository } from "@platform-admin/admin-role/interfaces/role";
import { CreateRoleDto } from "@platform-admin/admin-role/use-cases/dto/role-create.dto";
import { AdminRole } from "@platform-admin/admin-role/domain/admin-role";

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(input: CreateRoleDto): Promise<AdminRole> {
    const checkRole = await this.roleRepository.findOneByName(input.name);
    if (checkRole) {
      throw new Error('name exists');
    }

    const roleData = new AdminRole({
      name: input.name,
    });

    return await this.roleRepository.create(roleData);
  }
}
