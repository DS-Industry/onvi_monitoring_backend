import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '@prisma/client';

export interface RequiredRule {
  action: PermissionAction;
  subject: string;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
