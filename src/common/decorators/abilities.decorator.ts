import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '@platform-user/permissions/user-permissions/domain/permissionAction';

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
export class ManageWarehouseAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Warehouse';
}
export class ReadWarehouseAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'Warehouse';
}
export class CreateWarehouseAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'Warehouse';
}
export class UpdateWarehouseAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'Warehouse';
}
export class DeleteWarehouseAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'Warehouse';
}

export class ReadCorporateAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'LTYCorporate';
}

export class CreateCorporateAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'LTYCorporate';
}

export class UpdateCorporateAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'LTYCorporate';
}

export class DeleteCorporateAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'LTYCorporate';
}

export class ManageCorporateAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'LTYCorporate';
}
export class ManageCashCollectionAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Warehouse';
}
export class ReadCashCollectionAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'CashCollection';
}
export class CreateCashCollectionAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'CashCollection';
}
export class UpdateCashCollectionAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'CashCollection';
}
export class DeleteCashCollectionAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'CashCollection';
}
export class ManageShiftReportAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'ShiftReport';
}
export class ReadShiftReportAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'ShiftReport';
}
export class CreateShiftReportAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'ShiftReport';
}
export class UpdateShiftReportAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'ShiftReport';
}
export class DeleteShiftReportAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'ShiftReport';
}
export class ManageLoyaltyReportAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'LTYProgram';
}
export class ReadLoyaltyAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'LTYProgram';
}
export class CreateLoyaltyAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'LTYProgram';
}
export class UpdateLoyaltyAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'LTYProgram';
}
export class DeleteLoyaltyAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'LTYProgram';
}
export class ManageHrAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'Hr';
}
export class ReadHrAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'Hr';
}
export class CreateHrAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'Hr';
}
export class UpdateHrAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'Hr';
}
export class DeleteHrAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'Hr';
}
export class ManageManagerPaperAbility implements RequiredRule {
  action = PermissionAction.manage;
  subject = 'ManagerPaper';
}
export class ReadManagerPaperAbility implements RequiredRule {
  action = PermissionAction.read;
  subject = 'ManagerPaper';
}
export class CreateManagerPaperAbility implements RequiredRule {
  action = PermissionAction.create;
  subject = 'ManagerPaper';
}
export class UpdateManagerPaperAbility implements RequiredRule {
  action = PermissionAction.update;
  subject = 'ManagerPaper';
}
export class DeleteManagerPaperAbility implements RequiredRule {
  action = PermissionAction.delete;
  subject = 'ManagerPaper';
}
