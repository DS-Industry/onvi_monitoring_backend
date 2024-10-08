import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { OrganizationManageUserUseCase } from '@platform-user/user/use-cases/user-organization-manage';
import { UserPermissionDataResponseDto } from '@platform-user/user/use-cases/dto/user-permission-data-response.dto';
import { UserUpdateRoleDto } from '@platform-user/core-controller/dto/receive/user-update-role.dto';
import { User } from '@platform-user/user/domain/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { UserPermissionValidateRules } from '@platform-user/validate/validate-rules/user-permission-validate-rules';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly organizationManageUserUseCase: OrganizationManageUserUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly userPermissionValidateRules: UserPermissionValidateRules,
  ) {}

  @Get('worker')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getWorker(
    @Request() req: any,
  ): Promise<UserPermissionDataResponseDto[]> {
    try {
      const { user } = req;
      const ability =
        await this.caslAbilityFactory.createForPlatformManager(user);
      return await this.organizationManageUserUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('')
  @UseGuards(JwtGuard)
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
