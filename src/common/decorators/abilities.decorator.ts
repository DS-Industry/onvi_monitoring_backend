import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '@prisma/client';

export interface RequiredRule {
  action: PermissionAction;
  subject: string;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
//Organization
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
//Pos
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
//Incident
export class ManageIncidentAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Incident';
}
export class ReadIncidentAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'Incident';
}
export class CreateIncidentAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'Incident';
}
export class UpdateIncidentAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'Incident';
}
export class DeleteIncidentAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'Incident';
}
//TechTask
export class ManageTechTaskAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'TechTask';
}
export class ReadTechTaskAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'TechTask';
}
export class CreateTechTaskAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'TechTask';
}
export class UpdateTechTaskAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'TechTask';
}
export class DeleteTechTaskAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'TechTask';
}
