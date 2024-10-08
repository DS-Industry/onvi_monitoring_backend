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
import { DataByPermissionCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-data-by-permission';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { DataByDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data-by-device';
import { DataByDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-data-by-device';
import { DeviceFilterResponseDto } from '@platform-user/core-controller/dto/response/device-filter-response.dto';
import {
  DeviceOperationMonitoringResponseDto
} from "@platform-user/core-controller/dto/response/device-operation-monitoring-response.dto";
import { DeviceProgramResponseDto } from "@platform-user/core-controller/dto/response/device-program-response.dto";

@Controller('device')
export class DeviceController {
  constructor(
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly deviceCreateCarWashDevice: CreateCarWashDeviceUseCase,
    private readonly dataByPermissionCarWashDeviceUseCase: DataByPermissionCarWashDeviceUseCase,
    private readonly dataByDeviceOperationUseCase: DataByDeviceOperationUseCase,
    private readonly dataByDeviceProgramUseCase: DataByDeviceProgramUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceValidateRules: DeviceValidateRules,
  ) {}

  @Post('')
  @HttpCode(201)
  async create(
    @Body() data: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    try {
      await this.deviceValidateRules.createValidate(data.carWashPosId);
      return await this.deviceCreateCarWashDevice.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring/:id')
  @HttpCode(200)
  async monitoringDevice(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    try {
      return await this.dataByDeviceOperationUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program/:id')
  @HttpCode(200)
  async programDevice(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DataFilterDto,
  ): Promise<DeviceProgramResponseDto[]> {
    try {
      return await this.dataByDeviceProgramUseCase.execute(
        id,
        data.dateStart,
        data.dateEnd,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('type')
  @HttpCode(201)
  async createType(
    @Body() data: DeviceTypeCreateDto,
  ): Promise<CarWashDeviceType> {
    try {
      await this.deviceValidateRules.createTypeValidate(data.name, data.code);
      return await this.carWashDeviceTypeCreate.execute(data.name, data.code);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('type')
  @HttpCode(201)
  async updateType(
    @Body() data: DeviceTypeUpdateDto,
  ): Promise<CarWashDeviceType> {
    try {
      await this.deviceValidateRules.updateTypeValidate(data.id);
      return await this.carWashDeviceTypeUpdate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async filterViewDeviceByUser(
    @Request() req: any,
  ): Promise<DeviceFilterResponseDto[]> {
    try {
      const { user } = req;
      const ability =
        await this.caslAbilityFactory.createForPlatformManager(user);
      return await this.dataByPermissionCarWashDeviceUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter/pos/:posId')
  @HttpCode(200)
  async filterViewDeviceByPosId(
    @Param('posId', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.findMethodsCarWashDeviceUseCase.getAllByPos(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
