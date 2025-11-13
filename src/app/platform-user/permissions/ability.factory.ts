import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { AbilityBuilder } from '@casl/ability';
import { GetByIdObjectUseCase } from '@object-permission/use-case/object-get-by-id';
import { createPrismaAbility } from '@casl/prisma';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';

import { RedisService } from '@infra/cache/redis.service';

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
    private readonly objectGetById: GetByIdObjectUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,

    private readonly redisService: RedisService,
  ) {}

  async createForPlatformManager(
    user: User,
    isSuperAdmin?: boolean,
  ): Promise<any> {
    const cacheKey = `ability:${user.id}:`;
    const cachedRulesJson = await this.redisService.get(cacheKey);

    if (cachedRulesJson) {
      const rules = JSON.parse(cachedRulesJson);
      console.log('Using cached ability for user:', user.id);
      return createPrismaAbility(rules);
    }

    const permissions = await this.findMethodsRoleUseCase.getPermissionsById(
      user.userRoleId,
    );
    const organizationCondition =
      await this.findMethodsUserUseCase.getOrgPermissionById(user.id);
    const posCondition = await this.findMethodsUserUseCase.getPosPermissionById(
      user.id,
    );
    const loyaltyProgramCondition =
      await this.findMethodsUserUseCase.getLoyaltyProgramPermissionById(
        user.id,
      );

    const objectMap = {};
    for (const permission of permissions) {
      if (!objectMap[permission.objectId]) {
        objectMap[permission.objectId] = await this.objectGetById.execute(
          permission.objectId,
        );
      }
    }
    const dbPermissions = permissions.map((permission) => {
      let condition = {};
      if (objectMap[permission.objectId].name == 'Pos') {
        condition = {
          id: { in: posCondition },
          organizationId: { in: organizationCondition.map((org) => org.id) },
        };
      } else if (objectMap[permission.objectId].name == 'LTYProgram') {
        if (isSuperAdmin) {
          condition = {};
        } else {
          condition = {
            id: { in: loyaltyProgramCondition },
          };
        }
      } else if (objectMap[permission.objectId].name == 'Organization') {
        condition = {
          id: { in: organizationCondition.map((org) => org.id) },
        };
      } else if (
        objectMap[permission.objectId].name == 'Incident' ||
        objectMap[permission.objectId].name == 'TechTask' ||
        objectMap[permission.objectId].name == 'Warehouse' ||
        objectMap[permission.objectId].name == 'CashCollection' ||
        objectMap[permission.objectId].name == 'ShiftReport' ||
        objectMap[permission.objectId].name == 'ManagerPaper'
      ) {
        condition = {
          posId: { in: posCondition },
        };
      }
      return {
        id: permission.id,
        action: permission.action,
        condition: condition,
        permissionObject: objectMap[permission.objectId],
      };
    });

    const abilityBuilder = new AbilityBuilder(createPrismaAbility);
    for (const p of dbPermissions) {
      abilityBuilder.can(p.action, p.permissionObject.name, p?.condition);
    }
    const builtAbility = abilityBuilder.build();
    const serializedRules = JSON.stringify(builtAbility.rules);
    await this.redisService.set(cacheKey, serializedRules, 3600);

    return builtAbility;
  }
}
