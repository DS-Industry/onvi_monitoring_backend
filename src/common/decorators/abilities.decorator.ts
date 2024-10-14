import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '@prisma/client';

export interface RequiredRule {
  action: PermissionAction;
  subject: string;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export class ManageOrgAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Organization';
}

export class ReadOrgAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'Organization';
}

export class CreateOrgAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'Organization';
}
export class UpdateOrgAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'Organization';
}
export class DeleteOrgAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'Organization';
}
export class ManagePosAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Pos';
}

export class ReadPosAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'Pos';
}

export class CreatePosAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'Pos';
}
export class UpdatePosAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'Pos';
}
export class DeletePosAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'Pos';
}