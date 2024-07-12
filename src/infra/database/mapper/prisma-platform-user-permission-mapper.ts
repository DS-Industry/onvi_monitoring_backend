import {
    PlatformUserPermission,
    Prisma,
  } from '@prisma/client';
  import { UserPermission } from '@platform-user/user-permissions/domain/user-permission';
  import { JSONObject } from '@common/types/json-type';
  

  export class PrismaPlatformUserPermissionMapper {
    static toDomain(entity: PrismaPlatformUserPermission): UserPermission {
      if (!entity) return null;
      const condition = this.fromJson(entity?.condition);
      return new UserPermission({
        id: entity.id,
        action: entity.action,
        objectId: entity.objectId,
        condition: condition,
      });
    }

    static toPrisma(
        permission: UserPermission,
      ): Prisma.PlatformUserPermissionUncheckedCreateInput {
        const condition = this.toJson(permission?.condition);
        return {
          id: permission?.id,
          action: permission?.action,
          objectId: permission?.objectId,
          condition: permission?.condition,
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