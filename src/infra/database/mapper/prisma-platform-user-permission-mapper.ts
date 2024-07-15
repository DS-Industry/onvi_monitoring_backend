import {
    UserPermission as PrismaUserPermission,
    Prisma,
  } from '@prisma/client';
  import { UserPermission } from '@platform-user/user-permissions/domain/user-permissions';
  import { JSONObject } from '@common/types/json-type';
  

  export class PrismaPlatformUserPermissionMapper {
    static toDomain(entity: PrismaUserPermission): UserPermission {
      if (!entity) return null;
      return new UserPermission({
        id: entity.id,
        name: entity.name,
         permissionModule:entity?.permissionModule
      });
    }

    static toPrisma(
        permission: UserPermission,
      ): Prisma.UserPermissionUncheckedCreateInput {
        return {
         id: permission?.id,
         name:permission.name,
         permissionModule:permission?.permissionModule
        };
      }
    
      static toJson(condition: JSONObject): string {
        return JSON.stringify(condition);
      }
      static fromJson(json: Prisma.JsonValue): JSONObject {
        try {
          if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
            return json as JSONObject;
          }
        } catch (e) {
          throw new Error(e);
        }
      }    

  }  