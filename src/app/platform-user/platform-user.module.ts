import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { LoginAuthUseCase } from '@platform-user/auth/use-cases/auth-login';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { ValidateUserForLocalStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-local-strategy';
import { ValidateUserForJwtStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-jwt-strategy';
import { LocalStrategy } from '@platform-user/auth/strategies/strategy/local.strategy';
import { JwtStrategy } from '@platform-user/auth/strategies/strategy/jwt.strategy';
import { JwtRefreshStrategy } from '@platform-user/auth/strategies/strategy/jwt-refresh.strategy';
import { EmailStrategy } from '@platform-user/auth/strategies/strategy/email.strategy';
import { RegisterAuthUseCase } from '@platform-user/auth/use-cases/auth-register';
import { ActivateAuthUseCase } from '@platform-user/auth/use-cases/auth-activate';
import { PasswordResetUserUseCase } from '@platform-user/auth/use-cases/auth-password-reset';
import { ValidateUserEmailStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-email-strategy';
import { AuthRegisterWorkerUseCase } from '@platform-user/auth/use-cases/auth-register-worker';
import { SetCookiesUseCase } from '@platform-admin/auth/use-cases/auth-set-cookies';
import { LogoutUseCase } from '@platform-admin/auth/use-cases/auth-logout';
import { Auth } from '@platform-user/auth/controller/auth';
import { BcryptModule } from '@libs/bcrypt/module';
import { JwtModule } from '@libs/auth/module';
import { DateModule } from '@libs/date/module';
import { MailModule } from '@libs/mail/module';
import { ConfirmMailProvider } from '@platform-user/confirmMail/provider/confirmMail';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { ValidateConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-validate';
import { DeviceController } from '@platform-user/core-controller/device';
import { ValidateLib } from '@platform-user/validate/validate.lib';
import { DeviceValidateRules } from '@platform-user/validate/validate-rules/device-validate-rules';
import { OrganizationValidateRules } from '@platform-user/validate/validate-rules/organization-validate-rules';
import { OrganizationController } from '@platform-user/core-controller/organization';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { ObjectModule } from '@object-permission/object.module';
import { PosController } from '@platform-user/core-controller/pos';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { UserRepositoryProvider } from '@platform-user/user/provider/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { DownloadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-download';
import { UserController } from '@platform-user/user/controller/user';
import { FileModule } from '@libs/file/module';
import { PermissionsRepositoryProvider } from '@platform-user/permissions/user-permissions/provider/permissions';
import { RoleRepositoryProvider } from '@platform-user/permissions/user-role/provider/role';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { AuthValidateRules } from '@platform-user/validate/validate-rules/auth-validate-rules';
import { UserValidateRules } from '@platform-user/validate/validate-rules/user-validate-rules';
import { OrganizationManageUserUseCase } from '@platform-user/user/use-cases/user-organization-manage';
import { PermissionController } from '@platform-user/core-controller/permission';
import { UserPermissionValidateRules } from '@platform-user/validate/validate-rules/user-permission-validate-rules';
import { GetAllPermissionsInfoUseCases } from '@platform-user/permissions/use-cases/get-all-permissions-info';
import { IncidentController } from '@platform-user/core-controller/incident';
import { IncidentValidateRules } from '@platform-user/validate/validate-rules/incident-validate-rules';
import { EquipmentController } from '@platform-user/core-controller/equipment';
import { TechTaskController } from '@platform-user/core-controller/techTask';
import { EquipmentCoreModule } from '../../core/equipment-core/equipment-core.module';
import { TechTaskValidateRules } from '@platform-user/validate/validate-rules/techTask-rules';
import { WarehouseCoreModule } from '@warehouse/warehouse-core.module';
import { WarehouseController } from '@platform-user/core-controller/warehouse';
import { WarehouseValidateRules } from '@platform-user/validate/validate-rules/warehouse-validate-rules';
import { FinanceController } from '@platform-user/core-controller/finance';
import { FinanceCoreModule } from '@finance/finance-core.module';
import { FinanceValidateRules } from '@platform-user/validate/validate-rules/finance-rules';
import { ReportCoreModule } from '@report/report-core.module';
import { ReportController } from '@platform-user/core-controller/report';
import { ReportValidateRules } from '@platform-user/validate/validate-rules/report-validate-rules';
import { PosManageUserUseCase } from '@platform-user/user/use-cases/user-pos-manage';
import { ConnectionUserPosUseCase } from '@platform-user/user/use-cases/user-pos-connection';
import { PlacementController } from '@platform-user/core-controller/placement';
import { LoyaltyValidateRules } from "@platform-user/validate/validate-rules/loyalty-validate-rules";
import { LoyaltyCoreModule } from "@loyalty/loyalty-core.module";
import { LoyaltyController } from "@platform-user/core-controller/loyalty";
import { HrController } from "@platform-user/core-controller/hr";
import { HrCoreModule } from "@hr/hr-core.module";
import { HrValidateRules } from "@platform-user/validate/validate-rules/hr-validate-rules";
import { NotificationController } from "@platform-user/core-controller/notification";
import { NotificationValidateRules } from "@platform-user/validate/validate-rules/notification-validate-rules";
import { NotificationCoreModule } from "@notification/notification-core.module";
import { ManagerPaperController } from "@platform-user/core-controller/managerPaper";
import { ManagerPaperValidateRules } from "@platform-user/validate/validate-rules/manager-paper-validate-rules";
import { ManagerPaperCoreModule } from "@manager-paper/manager-paper-core.module";

const repositories: Provider[] = [
  ConfirmMailProvider,
  PermissionsRepositoryProvider,
  UserRepositoryProvider,
  RoleRepositoryProvider,
];
const controllers = [
  Auth,
  DeviceController,
  OrganizationController,
  PosController,
  UserController,
  PermissionController,
  IncidentController,
  TechTaskController,
  EquipmentController,
  WarehouseController,
  FinanceController,
  ReportController,
  PlacementController,
  LoyaltyController,
  HrController,
  NotificationController,
  ManagerPaperController,
];
const authUseCase: Provider[] = [
  SignRefreshTokenUseCase,
  LoginAuthUseCase,
  SignAccessTokenUseCase,
  ValidateUserForLocalStrategyUseCase,
  ValidateUserForJwtStrategyUseCase,
  LocalStrategy,
  JwtStrategy,
  JwtRefreshStrategy,
  EmailStrategy,
  RegisterAuthUseCase,
  ActivateAuthUseCase,
  PasswordResetUserUseCase,
  ValidateUserEmailStrategyUseCase,
  AuthRegisterWorkerUseCase,
  SetCookiesUseCase,
  LogoutUseCase,
];

const userUseCase: Provider[] = [
  FindMethodsUserUseCase,
  UpdateUserUseCase,
  DownloadAvatarUserUseCase,
  OrganizationManageUserUseCase,
  PosManageUserUseCase,
  ConnectionUserPosUseCase,
];

const confirmMailUseCase: Provider[] = [
  SendConfirmMailUseCase,
  ValidateConfirmMailUseCase,
];

const validate: Provider[] = [
  ValidateLib,
  DeviceValidateRules,
  OrganizationValidateRules,
  PosValidateRules,
  AuthValidateRules,
  UserValidateRules,
  UserPermissionValidateRules,
  IncidentValidateRules,
  TechTaskValidateRules,
  WarehouseValidateRules,
  FinanceValidateRules,
  ReportValidateRules,
  LoyaltyValidateRules,
  HrValidateRules,
  NotificationValidateRules,
  ManagerPaperValidateRules,
];

const permission: Provider[] = [
  AbilityFactory,
  FindMethodsRoleUseCase,
  GetAllPermissionsInfoUseCases,
];

@Module({
  imports: [
    PrismaModule,
    BcryptModule,
    JwtModule,
    DateModule,
    MailModule,
    BusinessCoreModule,
    EquipmentCoreModule,
    WarehouseCoreModule,
    FinanceCoreModule,
    ReportCoreModule,
    LoyaltyCoreModule,
    HrCoreModule,
    NotificationCoreModule,
    ManagerPaperCoreModule,
    ObjectModule,
    FileModule,
  ],
  controllers: [...controllers],
  providers: [
    ...authUseCase,
    ...repositories,
    ...confirmMailUseCase,
    ...validate,
    ...permission,
    ...userUseCase,
  ],
  exports: [...userUseCase,]
})
export class PlatformUserModule {}
