import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { PosMonitoringResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { MonitoringPosUseCase } from '@pos/pos/use-cases/pos-monitoring';
import { PosMonitoringDto } from '@platform-user/core-controller/dto/receive/pos-monitoring';
import { MonitoringFullByIdPosUseCase } from '@pos/pos/use-cases/pos-monitoring-full-by-id';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { ProgramPosUseCase } from '@pos/pos/use-cases/pos-program';
import {
  PosProgramDto,
  PosProgramResponseDto,
} from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { PosProgramFullUseCase } from '@pos/pos/use-cases/pos-program-full';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { CreatePosUseCase } from '@pos/pos/use-cases/pos-create';
import { UpdatePosUseCase } from '@pos/pos/use-cases/pos-update';
import { DeletePosUseCase } from '@pos/pos/use-cases/pos-delete';
import { PosCreateDto } from '@platform-user/core-controller/dto/receive/pos-create.dto';
import { PosUpdateDto } from '@platform-user/core-controller/dto/receive/pos-update.dto';
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
import { PosException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { PlacementFilterDto } from '@platform-user/core-controller/dto/receive/placement-filter.dto';
import { PosPlanFactResponseDto } from '@platform-user/core-controller/dto/response/pos-plan-fact-response.dto';
import { PlanFactPosUseCase } from '@pos/pos/use-cases/pos-plan-fact';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { CacheSWR } from '@common/decorators/cache-swr.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FalseOperationResponseDto } from '@platform-user/core-controller/dto/response/false-operation-response.dto';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { GetPositionSalaryRatesUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-get-position-salary-rates';
import { UpdatePositionSalaryRateUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update-position-salary-rate';
import { PosPositionSalaryRateUpdateDto } from '@platform-user/core-controller/dto/receive/pos-position-salary-rate-update.dto';

@Controller('pos')
export class PosController {
  constructor(
    private readonly createPosUseCase: CreatePosUseCase,
    private readonly updatePosUseCase: UpdatePosUseCase,
    private readonly deletePosUseCase: DeletePosUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly monitoringPosUseCase: MonitoringPosUseCase,
    private readonly monitoringFullByIdPosUseCase: MonitoringFullByIdPosUseCase,
    private readonly planFactPosUseCase: PlanFactPosUseCase,
    private readonly programPosUseCase: ProgramPosUseCase,
    private readonly connectionPosDeviceProgramTypeUseCase: ConnectionPosDeviceProgramTypeUseCase,
    private readonly posProgramFullUseCase: PosProgramFullUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly posValidateRules: PosValidateRules,
    private readonly getPositionSalaryRatesUseCase: GetPositionSalaryRatesUseCase,
    private readonly updatePositionSalaryRateUseCase: UpdatePositionSalaryRateUseCase,
  ) {}
  //Create pos
  @Post('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreatePosAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async create(
    @Body() data: PosCreateDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PosResponseDto> {
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
      if (e instanceof PosException) {
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

  @Patch(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PosUpdateDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PosResponseDto> {
    try {
      const { user, ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(id, ability);

      if (file) {
        return await this.updatePosUseCase.execute(id, data, user, pos, file);
      }
      return await this.updatePosUseCase.execute(id, data, user, pos);
    } catch (e) {
      if (e instanceof PosException) {
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

  @Patch(':id/delete')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @HttpCode(200)
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(id, ability);
      await this.deletePosUseCase.execute(id);
      return { status: 'success' };
    } catch (e) {
      if (e instanceof PosException) {
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

  //Get all pos for permission user
  @Get('filter')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async filterViewPosByUser(
    @Request() req: any,
    @Query() data: PlacementFilterDto,
  ): Promise<PosFilterResponseDto[]> {
    try {
      const { user } = req;

      const poses = await this.findMethodsPosUseCase.getAllByFilter({
        userId: user.id,
        placementId: data?.placementId,
        organizationId: data?.organizationId
          ? Number(data.organizationId)
          : undefined,
      });
      return poses.map((pos) => ({
        id: pos.id,
        name: pos.name,
        slug: pos.slug,
        address: pos.address?.location || '',
        organizationId: pos.organizationId,
        placementId: pos.placementId,
        timeZone: pos.timezone,
        posStatus: pos.status,
        createdAt: pos.createdAt,
        updatedAt: pos.updatedAt,
        createdById: pos.createdById,
        updatedById: pos.updatedById,
      }));
    } catch (e) {
      if (e instanceof PosException) {
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
  //Monitoring pos all or certain
  @Get('monitoring')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(120)
  async monitoringPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosMonitoringResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      let pos = null;
      if (params.posId) {
        pos = await this.posValidateRules.getOneByIdValidate(
          params.posId,
          ability,
        );
      }
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return await this.monitoringPosUseCase.execute({
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
        ability: ability,
        placementId: params.placementId,
        organizationId: params.organizationId,
        pos: pos,
        skip: skip,
        take: take,
      });
    } catch (e) {
      if (e instanceof PosException) {
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
  //Monitoring pos in detail
  @Get('monitoring/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(120)
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
      if (e instanceof PosException) {
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
  //Program pos all or certain
  @Get('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(120)
  async programPos(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosProgramResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      let pos = null;
      if (params.posId) {
        pos = await this.posValidateRules.getOneByIdValidate(
          params.posId,
          ability,
        );
      }
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return await this.programPosUseCase.execute({
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
        ability: ability,
        placementId: params?.placementId,
        organizationId: params.organizationId,
        pos: pos,
        skip: skip,
        take: take,
      });
    } catch (e) {
      if (e instanceof PosException) {
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
  //Program pos in detail
  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(120)
  async programFullPos(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<PosProgramDto[]> {
    try {
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(id, ability);
      return await this.posProgramFullUseCase.execute(
        data.dateStart,
        data.dateEnd,
        pos,
      );
    } catch (e) {
      if (e instanceof PosException) {
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
  //Plan-fact pos all or certain
  @Get('plan-fact')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(3600)
  async planFact(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<PosPlanFactResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      let pos = null;
      if (params.posId) {
        pos = await this.posValidateRules.getOneByIdValidate(
          params.posId,
          ability,
        );
      }
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return await this.planFactPosUseCase.execute({
        dateStart: params.dateStart,
        dateEnd: params.dateEnd,
        ability: ability,
        placementId: params?.placementId,
        pos: pos,
        skip: skip,
        take: take,
      });
    } catch (e) {
      if (e instanceof PosException) {
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
  @Get('false-operations/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  @CacheSWR(120)
  async falseOperationsPos(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
    @Query() data: DataFilterDto,
  ): Promise<FalseOperationResponseDto[]> {
    try {
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(
        posId,
        ability,
      );
      return await this.findMethodsDeviceOperationUseCase.getFalseOperationsByPosId(
        pos.id,
        data.dateStart,
        data.dateEnd,
      );
    } catch (e) {
      if (e instanceof PosException) {
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
  //Connection ProgramTypes
  @Patch('connection-program/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @HttpCode(201)
  async connectionProgramTypes(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
    @Body() data: PosConnectionProgramTypeDto,
  ): Promise<{ status: string }> {
    try {
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
    } catch (e) {
      if (e instanceof PosException) {
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
      const pos = await this.posValidateRules.getOneByIdValidate(id, ability);
      
      const positionSalaryRates = await this.getPositionSalaryRatesUseCase.execute(
        id,
        pos.organizationId,
      );

      return {
        ...pos,
        positionSalaryRates,
      };
    } catch (e) {
      if (e instanceof PosException) {
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

  @Patch(':id/position-salary-rate')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @HttpCode(200)
  async updatePositionSalaryRate(
    @Request() req: any,
    @Param('id', ParseIntPipe) posId: number,
    @Body() data: PosPositionSalaryRateUpdateDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      
      const updateData = {
        ...data,
        posId,
      };

      return await this.updatePositionSalaryRateUseCase.execute(updateData);
    } catch (e) {
      if (e instanceof PosException) {
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
