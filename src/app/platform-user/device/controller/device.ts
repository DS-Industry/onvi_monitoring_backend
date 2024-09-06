import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-create';
import { CarWashDeviceType } from '@device/deviceType/domen/deviceType';
import { DeviceTypeCreateDto } from '@platform-user/device/controller/dto/device-type-create.dto';
import { UpdateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-update';
import { DeviceTypeUpdateDto } from '@platform-user/device/controller/dto/device-type-update.dto';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';
import { PreCreateDeviceUseCase } from '@platform-user/device/use-case/device-pre-create';
import { FilterDeviceByUserUseCase } from '@platform-user/device/use-case/devica-filter-by-user';
import { DevicePreMonitoringDto } from '@platform-user/device/controller/dto/device-pre-monitoring.dto';
import { MonitoringDeviceUseCase } from '@platform-user/device/use-case/device-monitoring';
import { ProgramDeviceUseCase } from "@platform-user/device/use-case/device-program";
import { GetAllByPosCarWashDeviceUseCase } from "@device/device/use-cases/car-wash-device-get-all-by-pos";

@Controller('device')
export class DeviceController {
  constructor(
    private readonly carWashDeviceTypeCreate: CreateCarWashDeviceTypeUseCase,
    private readonly carWashDeviceTypeUpdate: UpdateCarWashDeviceTypeUseCase,
    private readonly carWashDevicePreCreate: PreCreateDeviceUseCase,
    private readonly filterDeviceByUserUseCase: FilterDeviceByUserUseCase,
    private readonly monitoringDeviceUseCase: MonitoringDeviceUseCase,
    private readonly programDeviceUseCase: ProgramDeviceUseCase,
    private readonly getAllByPosCarWashDeviceUseCase: GetAllByPosCarWashDeviceUseCase,
  ) {}

  @Post('')
  @HttpCode(201)
  async create(
    @Body() data: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    try {
      return await this.carWashDevicePreCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('monitoring/:id')
  @HttpCode(200)
  async monitoringDevice(
    @Param('id') deviceId: string,
    @Query() data: DevicePreMonitoringDto,
  ): Promise<any> {
    try {
      const id: number = parseInt(deviceId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
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
    @Param('id') deviceId: string,
    @Query() data: DevicePreMonitoringDto,
  ): Promise<any> {
    try {
      const id: number = parseInt(deviceId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
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
      return await this.carWashDeviceTypeUpdate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter/:userId')
  @HttpCode(200)
  async filterViewDeviceByUser(@Param('userId') data: string): Promise<any> {
    try {
      const userId = parseInt(data, 10);
      return await this.filterDeviceByUserUseCase.execute(userId);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter/pos/:posId')
  @HttpCode(200)
  async filterViewDeviceByPosId(@Param('posId') data: string): Promise<any> {
    try {
      const posId = parseInt(data, 10);
      return await this.getAllByPosCarWashDeviceUseCase.execute(posId);
    } catch (e) {
      throw new Error(e);
    }
  }
}
