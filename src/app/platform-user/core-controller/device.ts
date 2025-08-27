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
  UseGuards,
} from '@nestjs/common';
import { CreateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-create';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { DeviceTypeCreateDto } from '@platform-user/core-controller/dto/receive/device-type-create.dto';
import { UpdateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-update';
import { DeviceTypeUpdateDto } from '@platform-user/core-controller/dto/receive/device-type-update.dto';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/core-controller/dto/response/car-wash-device-full-data-response.dto';
import { CarWashDeviceCreateDto } from '@platform-user/core-controller/dto/receive/car-wash-device-create.dto';
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { DeviceValidateRules } from '@platform-user/validate/validate-rules/device-validate-rules';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { CreateCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { DataByDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data-by-device';
import { DataByDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data-by-device';
import { DeviceOperationMonitoringResponseDto } from '@platform-user/core-controller/dto/response/device-operation-monitoring-response.dto';
import { DeviceProgramResponseDto } from '@platform-user/core-controller/dto/response/device-program-response.dto';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ReadPosAbility,
} from '@common/decorators/abilities.decorator';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { DeviceException, PosException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { PosFilterDto } from '@platform-user/core-controller/dto/receive/pos-filter.dto';
import { DeviceMonitoringFilterDto } from "@platform-user/core-controller/dto/receive/device-monitoring-filter.dto";

@Controller('device')
export class DeviceController {
  constructor(
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly deviceCreateCarWashDevice: CreateCarWashDeviceUseCase,
    private readonly dataByDeviceOperationUseCase: DataByDeviceOperationUseCase,
    private readonly dataByDeviceProgramUseCase: DataByDeviceProgramUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly deviceValidateRules: DeviceValidateRules,
    private readonly posValidateRules: PosValidateRules,
  ) {}
  //Create device
  @Post('')
  @HttpCode(201)
  async create(
    @Body() data: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    try {
      const carWashDeviceType = await this.deviceValidateRules.createValidate(
        data.carWashPosId,
        data.name,
        data.carWashDeviceTypeId,
      );
      return await this.deviceCreateCarWashDevice.execute(
        data,
        carWashDeviceType,
      );
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Monitoring operation on device
  @Get('monitoring/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async monitoringDevice(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DeviceMonitoringFilterDto,
  ): Promise<DeviceOperationMonitoringResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      await this.deviceValidateRules.getByIdValidate(id, ability);
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.dataByDeviceOperationUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
        data.currencyType,
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Get all program type
  @Get('program/type')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getAllProgramType(
    @Request() req: any,
    @Query() data: PosFilterDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      if (data.posId) {
        await this.posValidateRules.getOneByIdValidate(data.posId, ability);
        return await this.findMethodsDeviceProgramTypeUseCase.getAllByPosId(
          data.posId,
        );
      } else {
        return await this.findMethodsDeviceProgramTypeUseCase.getAll();
      }
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Get program type by id
  @Get('program/type/:id')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getProgramTypeById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.deviceValidateRules.getProgramTypeById(id);
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Program on device
  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async programDevice(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<DeviceProgramResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { ability } = req;
      await this.deviceValidateRules.getByIdValidate(id, ability);
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.dataByDeviceProgramUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Create type device
  @Post('type')
  @HttpCode(201)
  async createType(
    @Body() data: DeviceTypeCreateDto,
  ): Promise<CarWashDeviceType> {
    try {
      await this.deviceValidateRules.createTypeValidate(data.name, data.code);
      return await this.carWashDeviceTypeCreate.execute(data.name, data.code);
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //Update type device
  @Patch('type')
  @HttpCode(201)
  async updateType(
    @Body() data: DeviceTypeUpdateDto,
  ): Promise<CarWashDeviceType> {
    try {
      const carWashDeviceType =
        await this.deviceValidateRules.updateTypeValidate(data.id);
      return await this.carWashDeviceTypeUpdate.execute(
        data,
        carWashDeviceType,
      );
    } catch (e) {
      if (e instanceof DeviceException) {
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
  //All device for pos DELETE?
  @Get('filter/pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async filterViewDeviceByPosId(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(id, ability);
      return await this.findMethodsCarWashDeviceUseCase.getAllByPos(id);
    } catch (e) {
      if (e instanceof DeviceException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else if (e instanceof PosException) {
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
