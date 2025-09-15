import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
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
import { LoyaltyProgramPermissionsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-permissions-response.dto';
import { LoyaltyProgramManageUserUseCase } from '@platform-user/user/use-cases/user-loyalty-program-manage';
import { ConnectedLoyaltyProgramUserDto } from '@platform-user/core-controller/dto/receive/connected-loyalty-program-user.dto';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { ConnectionUserLoyaltyProgramUseCase } from '@platform-user/user/use-cases/user-loyalty-program-connection';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { RedisService } from '@infra/cache/redis.service';
import { WorkerPermissionFilterDto } from '@platform-user/core-controller/dto/receive/worker-permission-filter.dto';
import { OrganizationValidateRules } from '@platform-user/validate/validate-rules/organization-validate-rules';
import { StatusUser } from '@prisma/client';

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
    private readonly loyaltyProgramManageUserUseCase: LoyaltyProgramManageUserUseCase,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
    private readonly connectionUserLoyaltyProgramUseCase: ConnectionUserLoyaltyProgramUseCase,
    private readonly redisService: RedisService,
    private readonly organizationValidateRules: OrganizationValidateRules,
  ) {}

  private async deleteUserKeysSafely(userId: number) {
    const pattern = `*:${userId}:*`;
    let cursor = '0';

    do {
      const [nextCursor, keys] = await this.redisService.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        '100',
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        await this.redisService.delMultiple(...keys);
      }
    } while (cursor !== '0');

    console.log(`Finished deleting keys for user ${userId}`);
  }

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
  @Get('worker/:orgId')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getWorker(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() params: WorkerPermissionFilterDto,
  ): Promise<UserPermissionDataResponseDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      const organization =
        await this.organizationValidateRules.getContact(orgId);
      return await this.organizationManageUserUseCase.execute(
        organization,
        skip,
        take,
        params.roleId,
        params.status,
        params.name,
      );
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
  @Get('worker-count/:orgId')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getCountWorker(
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<{ count: number }> {
    try {
      return await this.findMethodsUserUseCase.getCountByOrgId(orgId);
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
      const poses = await this.findMethodsPosUseCase.getAllByFilter({
        userId: userId,
      });
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

      await this.deleteUserKeysSafely(userId);

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
  
  @Get('loyalty-program/:userId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(200)
  async getLoyaltyProgramByUserId(
    @Request() req: any,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<LoyaltyProgramPermissionsResponseDto[]> {
    try {
      const { ability } = req;
      
      await this.userPermissionValidateRules.getUserLoyaltyProgramAccessValidate(userId, ability);
      
      const loyaltyPrograms = await this.findMethodsLoyaltyProgramUseCase.getAllByUserId(userId);
      return loyaltyPrograms.map((loyaltyProgram) => ({
        id: loyaltyProgram.id,
        name: loyaltyProgram.name,
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

  @Get('loyalty-program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(200)
  async getLoyaltyProgram(
    @Request() req: any,
    @Query('organizationId') organizationId?: string,
  ): Promise<LoyaltyProgramPermissionsResponseDto[]> {
    try {
      const { ability } = req;
      
      if (organizationId) {
        const loyaltyPrograms = await this.findMethodsLoyaltyProgramUseCase.getAllByAbility(
          ability,
          Number(organizationId),
        );
        return loyaltyPrograms.map((loyaltyProgram) => ({
          id: loyaltyProgram.id,
          name: loyaltyProgram.name,
        }));
      }
      
      return await this.loyaltyProgramManageUserUseCase.execute(ability);
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

  @Patch('loyalty-program-user/:userId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(201)
  async updateConnectedUserLoyaltyProgram(
    @Request() req: any,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: ConnectedLoyaltyProgramUserDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.userPermissionValidateRules.updateConnectedUserLoyaltyProgramValidate(
        body.loyaltyProgramIds,
        ability,
      );

      await this.deleteUserKeysSafely(userId);

      return await this.connectionUserLoyaltyProgramUseCase.execute(body.loyaltyProgramIds, userId);
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

      await this.deleteUserKeysSafely(body.userId);

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
  //Block user by ID
  @Patch('worker/:id/block')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(200)
  async blockUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.userUpdate.execute({
        id: id,
        status: StatusUser.BLOCKED,
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
