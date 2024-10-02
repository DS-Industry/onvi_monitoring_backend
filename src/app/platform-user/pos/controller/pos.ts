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
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { FilterByUserPosUseCase } from '@pos/pos/use-cases/pos-filter-by-user';
import { PosMonitoringResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-response.dto';
import { MonitoringPosUseCase } from '@pos/pos/use-cases/pos-monitoring';
import { PosPreMonitoringDto } from '@platform-user/pos/controller/dto/pos-pre-monitoring';
import { MonitoringFullByIdPosUseCase } from '@pos/pos/use-cases/pos-monitoring-full-by-id';
import { PosPreMonitoringFullDto } from '@platform-user/pos/controller/dto/pos-pre-monitoring-full.dto';
import { PosMonitoringFullResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-full-response.dto';
import { ProgramPosUseCase } from '@pos/pos/use-cases/pos-program';
import { PosProgramResponseDto } from '@platform-user/pos/controller/dto/pos-program-response.dto';
import { PosProgramFullUseCase } from '@pos/pos/use-cases/pos-program-full';
import { PosValidateRules } from '@platform-user/pos/controller/validate/pos-validate-rules';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { PosCreateDto } from '@platform-user/pos/controller/dto/pos-create.dto';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { FindMethodsPosUseCase } from "@pos/pos/use-cases/pos-find-methods";

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
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(@Body() data: PosCreateDto, @Request() req: any): Promise<any> {
    try {
      const { user } = req;
      await this.posValidateRules.createValidate(data.name);
      const pos = {
        ...data,
        organizationId: Number(data.organizationId),
        timezone: Number(data.timezone),
        monthlyPlan: Number(data.monthlyPlan),
      };
      return await this.createPosUseCase.execute(pos, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring')
  @HttpCode(200)
  async monitoringPos(
    @Query() params: PosPreMonitoringDto,
  ): Promise<PosMonitoringResponseDto[]> {
    try {
      const input = {
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
        posId: params.posId,
      };
      return await this.monitoringPosUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring/:id')
  @HttpCode(200)
  async monitoringFullPos(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: PosPreMonitoringFullDto,
  ): Promise<PosMonitoringFullResponseDto[]> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        posId: id,
      };
      return await this.monitoringFullByIdPosUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program')
  @HttpCode(200)
  async programPos(
    @Query() params: PosPreMonitoringDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const input = {
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
        posId: params.posId,
      };
      return await this.programPosUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program/:id')
  @HttpCode(200)
  async programFullPos(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: PosPreMonitoringFullDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        posId: id,
      };
      return await this.posProgramFullUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.findMethodsPosUseCase.getById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('access')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async filterViewPosByUser(@Request() req: any): Promise<any> {
    try {
      const { user } = req;
      const ability =
        await this.caslAbilityFactory.createForPlatformManager(user);
      return await this.filterByUserPosUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }
}
