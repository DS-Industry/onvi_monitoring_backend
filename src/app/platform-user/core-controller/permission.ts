import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  ReadOrgAbility,
  ReadPosAbility,
  UpdateOrgAbility,
} from '@common/decorators/abilities.decorator';
import { GetAllPermissionsInfoUseCases } from '@platform-user/permissions/use-cases/get-all-permissions-info';
import { UserException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { UserRoleResponseDto } from '@platform-user/core-controller/dto/response/user-role-response.dto';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { PosPermissionsResponseDto } from '@platform-user/core-controller/dto/response/pos-permissions-response.dto';
import { PosManageUserUseCase } from '@platform-user/user/use-cases/user-pos-manage';
import { ConnectedPodUserDto } from '@platform-user/core-controller/dto/receive/connected-pod-user.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { ConnectionUserPosUseCase } from '@platform-user/user/use-cases/user-pos-connection';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';

@Controller('permission')
export class PermissionController {
  constructor(
    private readonly organizationManageUserUseCase: OrganizationManageUserUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly userPermissionValidateRules: UserPermissionValidateRules,
    private readonly getAllPermissionsInfoUseCases: GetAllPermissionsInfoUseCases,
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
    private readonly posManageUserUseCase: PosManageUserUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly connectionUserPosUseCase: ConnectionUserPosUseCase,
  ) {}
  @Get('roles')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @HttpCode(200)
  async getRoles(): Promise<UserRoleResponseDto[]> {
    try {
      const roles = await this.findMethodsRoleUseCase.getAll();
      return roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      }));
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('role-permission-info')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(200)
  async getPermissionRoles(): Promise<any> {
    try {
      return await this.getAllPermissionsInfoUseCases.getAllPermissionsInfo();
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('worker')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getWorker(
    @Request() req: any,
  ): Promise<UserPermissionDataResponseDto[]> {
    try {
      const { user } = req;
      return await this.organizationManageUserUseCase.execute(user);
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('worker-by-pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getWorkerByPos(
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<User[]> {
    try {
      return await this.findMethodsUserUseCase.getAllByPosId(posId);
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('pos/:userId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(200)
  async getPosByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PosPermissionsResponseDto[]> {
    try {
      const poses = await this.findMethodsPosUseCase.getAllByUserId(userId);
      return poses.map((pos) => ({
        id: pos.id,
        name: pos.name,
      }));
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //All pos for permission org DELETE?
  @Get('pos')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(200)
  async getPos(@Request() req: any): Promise<PosPermissionsResponseDto[]> {
    try {
      const { ability } = req;
      return await this.posManageUserUseCase.execute(ability);
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Patch('pos-user/:userId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(201)
  async updateConnectedUserPos(
    @Request() req: any,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: ConnectedPodUserDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.userPermissionValidateRules.updateConnectedUserPosValidate(
        body.posIds,
        ability,
      );
      return await this.connectionUserPosUseCase.execute(body.posIds, userId);
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Patch('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(201)
  async updateRole(
    @Request() req: any,
    @Body() body: UserUpdateRoleDto,
  ): Promise<User> {
    try {
      await this.userPermissionValidateRules.updateRoleValidate(
        body.userId,
        body.roleId,
      );
      return await this.userUpdate.execute({
        id: body.userId,
        roleId: body.roleId,
      });
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
