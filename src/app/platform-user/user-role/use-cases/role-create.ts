import { Injectable } from "@nestjs/common";
import { IRoleRepository } from "@platform-user/user-role/interfaces/role";
import { CreateRoleDto } from "@platform-user/user-role/controller/dto/role-create.dto";
import { UserRole } from "@platform-user/user-role/domain/user-role";


@Injectable()
export class CreateRoleUseCase{
    constructor(private readonly roleRepositary:IRoleRepository){}

    async execute(input:CreateRoleDto):Promise<UserRole>{
        const checkRole = await this.roleRepositary.findOneByName(input.name)
        if(checkRole){
            throw new Error("name already exists")
        }
        const roleData = new UserRole({
            name:input.name
        })
        return await this.roleRepositary.create(roleData)
    }
}


