import { UserRole } from '@platform-user/user-role/domain/user-role';
import {
  PlatformUserRole,
  Prisma,
} from '@prisma/client';

export class PrismaPlatformUserRoleMapper{
    static toDomain(entity:PrismaPlatformUserRole):UserRole{
        if(!entity){
            return null;
        }
        return new UserRole({
            id:entity.id,
            name:entity.name
        })
    }

static toPrisma(
    role:UserRole
):Prisma.PlatformUserRoleUncheckedCreateInput{
    return {
        id:role?.id,
        name:role.name
    }
}
}





