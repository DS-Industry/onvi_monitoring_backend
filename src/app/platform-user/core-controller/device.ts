import {
  Body,
  Controller,
  Get,
  HttpCode, HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from "@nestjs/common";
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
import { DataByPermissionCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-data-by-permission';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { DataByDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data-by-device';
import { DataByDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data-by-device';
import { DeviceFilterResponseDto } from '@platform-user/core-controller/dto/response/device-filter-response.dto';
import { DeviceOperationMonitoringResponseDto } from '@platform-user/core-controller/dto/response/device-operation-monitoring-response.dto';
import { DeviceProgramResponseDto } from '@platform-user/core-controller/dto/response/device-program-response.dto';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ReadPosAbility,
} from '@common/decorators/abilities.decorator';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { DeviceException, PosException, UserException } from "@exception/option.exceptions";
import { CustomHttpException } from "@exception/custom-http.exception";

@Controller('device')
export class DeviceController {
  constructor(
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly deviceCreateCarWashDevice: CreateCarWashDeviceUseCase,
    private readonly dataByPermissionCarWashDeviceUseCase: DataByPermissionCarWashDeviceUseCase,
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
    @Query() data: DataFilterDto,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    try {
      const { ability } = req;
      await this.deviceValidateRules.getByIdValidate(id, ability);
      return await this.dataByDeviceOperationUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
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
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAllProgramType(): Promise<any> {
    try {
      return await this.findMethodsDeviceProgramTypeUseCase.getAll();
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
  ): Promise<DeviceProgramResponseDto[]> {
    try {
      const { ability } = req;
      await this.deviceValidateRules.getByIdValidate(id, ability);
      return await this.dataByDeviceProgramUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
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
  //All device for user
  @Get('filter')
  @HttpCode(200)
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  async filterViewDeviceByUser(
    @Request() req: any,
  ): Promise<DeviceFilterResponseDto[]> {
    try {
      const { ability } = req;
      return await this.dataByPermissionCarWashDeviceUseCase.execute(ability);
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
  //All device for pos
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
