import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/user-role/interfaces/role';
import { UserRole } from '@platform-user/user-role/domain/user-role';

@Injectable()
export class GetAllRoleUseCase{
    constructor(private roleRepositary:IRoleRepository) {}

    async execute():Promise<UserRole[]>{
        return await this.roleRepositary.findAll()
    }
}


