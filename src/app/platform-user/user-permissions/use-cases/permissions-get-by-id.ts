import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-user/user-permissions/interfaces/permissions';

@Injectable()
export class GetByIdPermissionsUseCase{
    constructor(private permissionsRepositary:IPermissionsRepository){}

    async execute(input:number){
        const permissions = await this.permissionsRepositary.findOneById(input)
        if(!permissions){
         throw new Error("permission not exists")
        }
        return permissions
    }
}