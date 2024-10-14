import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { FilterByUserPosUseCase } from '@pos/pos/use-cases/pos-filter-by-user';
import { PosMonitoringResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { MonitoringPosUseCase } from '@pos/pos/use-cases/pos-monitoring';
import { PosMonitoringDto } from '@platform-user/core-controller/dto/receive/pos-monitoring';
import { MonitoringFullByIdPosUseCase } from '@pos/pos/use-cases/pos-monitoring-full-by-id';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { ProgramPosUseCase } from '@pos/pos/use-cases/pos-program';
import { PosProgramResponseDto } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { PosProgramFullUseCase } from '@pos/pos/use-cases/pos-program-full';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { PosCreateDto } from '@platform-user/core-controller/dto/receive/pos-create.dto';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { PosFilterResponseDto } from '@platform-user/core-controller/dto/response/pos-filter-by-response.dto';
import {
  CheckAbilities,
  CreatePosAbility,
  ReadPosAbility,
} from '@common/decorators/abilities.decorator';
import { PermissionAction } from '@prisma/client';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import { ForbiddenError } from '@casl/ability';

@Controller('pos')
export class PosController {
  constructor(
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly createPosUseCase: CreatePosUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly filterByUserPosUseCase: FilterByUserPosUseCase,
    private readonly monitoringPosUseCase: MonitoringPosUseCase,
    private readonly monitoringFullByIdPosUseCase: MonitoringFullByIdPosUseCase,
    private readonly programPosUseCase: ProgramPosUseCase,
    private readonly posProgramFullUseCase: PosProgramFullUseCase,
    private readonly posValidateRules: PosValidateRules,
  ) {}

  @Post('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreatePosAbility())
  @HttpCode(201)
  async create(
    @Body() data: PosCreateDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.posValidateRules.createValidate(
        data.name,
        data.organizationId,
      );
      if (file) {
        return await this.createPosUseCase.execute(data, user, file);
      }
      return await this.createPosUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async monitoringFullPos(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<PosMonitoringFullResponseDto[]> {
    try {
      await this.posValidateRules.getOneByIdValidate(id);
      return await this.monitoringFullByIdPosUseCase.execute(
        data.dateStart,
        data.dateEnd,
        id,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async monitoringPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosMonitoringResponseDto[]> {
    try {
      const ability = req.ability;
      if (params.posId) {
        await this.posValidateRules.getOneByIdValidate(params.posId);
      }
      return await this.monitoringPosUseCase.execute(
        params.dateStart,
        params.dateEnd,
        ability,
        params.posId,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async programPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const ability = req.ability;
      if (params.posId) {
        await this.posValidateRules.getOneByIdValidate(params.posId);
      }
      return await this.programPosUseCase.execute(
        params.dateStart,
        params.dateEnd,
        ability,
        params.posId,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async programFullPos(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      await this.posValidateRules.getOneByIdValidate(id);
      return await this.posProgramFullUseCase.execute(
        data.dateStart,
        data.dateEnd,
        id,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.posValidateRules.getOneByIdValidate(id);
      return this.findMethodsPosUseCase.getById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async filterViewPosByUser(
    @Request() req: any,
  ): Promise<PosFilterResponseDto[]> {
    try {
      const ability = req.ability;
      return await this.filterByUserPosUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }
}
