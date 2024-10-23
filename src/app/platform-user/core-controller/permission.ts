import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { OrganizationManageUserUseCase } from '@platform-user/user/use-cases/user-organization-manage';
import { UserPermissionDataResponseDto } from '@platform-user/user/use-cases/dto/user-permission-data-response.dto';
import { UserUpdateRoleDto } from '@platform-user/core-controller/dto/receive/user-update-role.dto';
import { User } from '@platform-user/user/domain/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { UserPermissionValidateRules } from '@platform-user/validate/validate-rules/user-permission-validate-rules';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ManageOrgAbility,
} from '@common/decorators/abilities.decorator';
import { GetAllPermissionsInfoUseCases } from '@platform-user/permissions/use-cases/get-all-permissions-info';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly organizationManageUserUseCase: OrganizationManageUserUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly userPermissionValidateRules: UserPermissionValidateRules,
    private readonly getAllPermissionsInfoUseCases: GetAllPermissionsInfoUseCases,
  ) {}
  @Get('role')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(200)
  async getPermissionRoles(): Promise<any> {
    try {
      return await this.getAllPermissionsInfoUseCases.getAllPermissionsInfo();
    } catch (e) {
      throw new Error(e);
    }
  }
  //All worker for permission org
  @Get('worker')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(200)
  async getWorker(
    @Request() req: any,
  ): Promise<UserPermissionDataResponseDto[]> {
    try {
      const { ability } = req;
      return await this.organizationManageUserUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Update worker role
  @Patch('')
  @UseGuards(JwtGuard)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(201)
  async updateRole(
    @Request() req: any,
    @Body() body: UserUpdateRoleDto,
  ): Promise<User> {
    await this.userPermissionValidateRules.updateRoleValidate(
      body.userId,
      body.roleId,
    );
    return await this.userUpdate.execute({
      id: body.userId,
      roleId: body.roleId,
    });
  }
}
