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
} from '@nestjs/common';
import { CreateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-create';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { DeviceTypeCreateDto } from '@platform-user/device/controller/dto/device-type-create.dto';
import { UpdateCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-update';
import { DeviceTypeUpdateDto } from '@platform-user/device/controller/dto/device-type-update.dto';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';
import { FilterDeviceByUserUseCase } from '@platform-user/device/use-case/devica-filter-by-user';
import { DevicePreMonitoringDto } from '@platform-user/device/controller/dto/device-pre-monitoring.dto';
import { MonitoringDeviceUseCase } from '@platform-user/device/use-case/device-monitoring';
import { ProgramDeviceUseCase } from '@platform-user/device/use-case/device-program';
import { DeviceValidateRules } from '@platform-user/device/controller/validate/device-validate-rules';
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";
import { CreateCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-create";

@Controller('device')
export class DeviceController {
  constructor(
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly deviceCreateCarWashDevice: CreateCarWashDeviceUseCase,
    private readonly filterDeviceByUserUseCase: FilterDeviceByUserUseCase,
    private readonly monitoringDeviceUseCase: MonitoringDeviceUseCase,
    private readonly programDeviceUseCase: ProgramDeviceUseCase,
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
    @Query() data: DevicePreMonitoringDto,
  ): Promise<any> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        deviceId: id,
      };
      return await this.monitoringDeviceUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('program/:id')
  @HttpCode(200)
  async programDevice(
    @Param('id', ParseIntPipe) id: number,
    @Query() data: DevicePreMonitoringDto,
  ): Promise<any> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        deviceId: id,
      };
      return await this.programDeviceUseCase.execute(input);
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

  @Get('filter/:userId')
  @HttpCode(200)
  async filterViewDeviceByUser(
    @Param('userId', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.filterDeviceByUserUseCase.execute(id);
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
