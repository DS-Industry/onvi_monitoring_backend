import { Injectable } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-user/user-permissions/interfaces/permissions';
import { UserPermission } from '@platform-user/user-permissions/domain/user-permission';
import { PermissionRepository } from '../repository/permission';

@Injectable()
export class GetAllPermissionsUseCases{
    constructor(private PermissionRepository:IPermissionsRepository){}
    async execute():Promise<UserPermission[]>{
        return await this.PermissionRepository.findAll()
    }
}