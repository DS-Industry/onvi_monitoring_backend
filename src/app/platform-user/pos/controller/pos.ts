import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { PreCreatePosUseCase } from '@platform-user/pos/use-cases/pos-pre-create';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';
import { FilterByUserPosUseCase } from '@platform-user/pos/use-cases/pos-filter-by-user';
import { PosPreCreateDto } from '@platform-user/pos/controller/dto/pos-pre-create.dto';
import { PosMonitoringResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-response.dto';
import { MonitoringPosUseCase } from '@platform-user/pos/use-cases/pos-monitoring';
import { PosPreMonitoringDto } from '@platform-user/pos/controller/dto/pos-pre-monitoring';
import { MonitoringFullByIdPosUseCase } from '@platform-user/pos/use-cases/pos-monitoring-full-by-id';
import { PosPreMonitoringFullDto } from '@platform-user/pos/controller/dto/pos-pre-monitoring-full.dto';
import { PosMonitoringFullResponseDto } from '@platform-user/pos/controller/dto/pos-monitoring-full-response.dto';
import { ProgramPosUseCase } from '@platform-user/pos/use-cases/pos-program';
import { PosProgramResponseDto } from '@platform-user/pos/controller/dto/pos-program-response.dto';
import { PosProgramFullUseCase } from '@platform-user/pos/use-cases/pos-program-full';

@Controller('pos')
export class PosController {
  constructor(
    private readonly preCreatePosUseCase: PreCreatePosUseCase,
    private readonly getByIdPosUseCase: GetByIdPosUseCase,
    private readonly filterByUserPosUseCase: FilterByUserPosUseCase,
    private readonly monitoringPosUseCase: MonitoringPosUseCase,
    private readonly monitoringFullByIdPosUseCase: MonitoringFullByIdPosUseCase,
    private readonly programPosUseCase: ProgramPosUseCase,
    private readonly posProgramFullUseCase: PosProgramFullUseCase,
  ) {}

  @Post('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(
    @Body() data: PosPreCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      const pos = {
        ...data,
        organizationId: Number(data.organizationId),
        timezone: Number(data.timezone),
        monthlyPlan: Number(data.monthlyPlan),
      };
      return await this.preCreatePosUseCase.execute(pos, user);
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
        dateStart: new Date(params.dateStart),
        dateEnd: new Date(params.dateEnd),
        posId: Number(params.posId),
      };
      return await this.monitoringPosUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring/:id')
  @HttpCode(200)
  async monitoringFullPos(
    @Param('id') posId: string,
    @Query() data: PosPreMonitoringFullDto,
  ): Promise<PosMonitoringFullResponseDto[]> {
    try {
      const id: number = parseInt(posId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
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
        dateStart: new Date(params.dateStart),
        dateEnd: new Date(params.dateEnd),
        posId: Number(params.posId),
      };
      return await this.programPosUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program/:id')
  @HttpCode(200)
  async programFullPos(
    @Param('id') posId: string,
    @Query() data: PosPreMonitoringFullDto,
  ): Promise<PosProgramResponseDto[]> {
    try {
      const id: number = parseInt(posId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        posId: id,
      };
      return await this.posProgramFullUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.getByIdPosUseCase.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter/:userId')
  @HttpCode(200)
  async filterViewPosByUser(@Param('userId') data: string): Promise<any> {
    try {
      const userId = parseInt(data, 10);
      return await this.filterByUserPosUseCase.execute(userId);
    } catch (e) {
      throw new Error(e);
    }
  }
}
