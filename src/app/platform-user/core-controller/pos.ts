import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
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
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { PosFilterResponseDto } from '@platform-user/core-controller/dto/response/pos-filter-by-response.dto';
import {
  CheckAbilities,
  CreatePosAbility,
  ReadPosAbility,
  UpdatePosAbility,
} from '@common/decorators/abilities.decorator';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import { ConnectionPosDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-connection-pos';
import { PosConnectionProgramTypeDto } from '@platform-user/core-controller/dto/receive/pos-connection-programType.dto';

@Controller('pos')
export class PosController {
  constructor(
    private readonly createPosUseCase: CreatePosUseCase,
    private readonly filterByUserPosUseCase: FilterByUserPosUseCase,
    private readonly monitoringPosUseCase: MonitoringPosUseCase,
    private readonly monitoringFullByIdPosUseCase: MonitoringFullByIdPosUseCase,
    private readonly programPosUseCase: ProgramPosUseCase,
    private readonly connectionPosDeviceProgramTypeUseCase: ConnectionPosDeviceProgramTypeUseCase,
    private readonly posProgramFullUseCase: PosProgramFullUseCase,
    private readonly posValidateRules: PosValidateRules,
  ) {}
  //Create pos
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
      const { user, ability } = req;
      await this.posValidateRules.createValidate(
        data.name,
        data.organizationId,
        ability,
      );
      if (file) {
        return await this.createPosUseCase.execute(data, user, file);
      }
      return await this.createPosUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all pos for permission user
  @Get('filter')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async filterViewPosByUser(
    @Request() req: any,
  ): Promise<PosFilterResponseDto[]> {
    try {
      const { ability } = req;
      return await this.filterByUserPosUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Monitoring pos all or certain
  @Get('monitoring')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async monitoringPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosMonitoringResponseDto[]> {
    try {
      const { ability } = req;
      let pos = null;
      if (params.posId) {
        pos = await this.posValidateRules.getOneByIdValidate(
          params.posId,
          ability,
        );
      }
      return await this.monitoringPosUseCase.execute(
        params.dateStart,
        params.dateEnd,
        ability,
        pos,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Monitoring pos in detail
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
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(id, ability);
      return await this.monitoringFullByIdPosUseCase.execute(
        data.dateStart,
        data.dateEnd,
        pos,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Program pos all or certain
  @Get('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async programPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const { ability } = req;
      let pos = null;
      if (params.posId) {
        pos = await this.posValidateRules.getOneByIdValidate(
          params.posId,
          ability,
        );
      }
      return await this.programPosUseCase.execute(
        params.dateStart,
        params.dateEnd,
        ability,
        pos,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Program pos in detail
  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async programFullPos(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(id, ability);
      return await this.posProgramFullUseCase.execute(
        data.dateStart,
        data.dateEnd,
        pos,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Connection ProgramTypes
  @Patch('connection-program/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @HttpCode(201)
  async connectionProgramTypes(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
    @Body() data: PosConnectionProgramTypeDto,
  ): Promise<any> {
    const { ability } = req;
    await this.posValidateRules.connectionProgramTypesValidate(
      id,
      data.programTypeIds,
      ability,
    );
    return await this.connectionPosDeviceProgramTypeUseCase.execute(
      id,
      data.programTypeIds,
    );
  }

  //Get pos by id
  @Get(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getOneById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      return await this.posValidateRules.getOneByIdValidate(id, ability);
    } catch (e) {
      throw new Error(e);
    }
  }
}
