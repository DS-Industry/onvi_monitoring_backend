import { Injectable } from '@nestjs/common';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';
import {
  DEVICE_CREATE_EXCEPTION_CODE,
  DEVICE_CREATE_TYPE_EXCEPTION_CODE,
  DEVICE_GET_BY_ID_EXCEPTION_CODE,
  DEVICE_PROGRAM_TYPE_GET_BY_ID_EXCEPTION_CODE,
  DEVICE_UPDATE_TYPE_EXCEPTION_CODE,
} from '@constant/error.constants';
import { DeviceException } from '@exception/option.exceptions';

@Injectable()
export class DeviceValidateRules {
  constructor(
    private readonly validateLib: ValidateLib,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  public async createValidate(
    posId: number,
    name: string,
    deviceTypeId: number,
  ): Promise<CarWashDeviceType> {
    const response = [];

    response.push(await this.validateLib.posByIdExists(posId));
    response.push(
      await this.validateLib.deviceByNameAndPosIdNotExists(posId, name),
    );
    const deviceType =
      await this.validateLib.deviceTypeByIdExists(deviceTypeId);
    response.push(deviceType);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.DEVICE,
      DEVICE_CREATE_EXCEPTION_CODE,
    );
    return deviceType.object;
  }
  public async createTypeValidate(name: string, code: string) {
    const response = [];
    response.push(await this.validateLib.deviceTypeByNameNotExists(name));
    response.push(await this.validateLib.deviceTypeByCodeNotExists(code));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.DEVICE,
      DEVICE_CREATE_TYPE_EXCEPTION_CODE,
    );
  }

  public async updateTypeValidate(id: number) {
    const response = await this.validateLib.deviceTypeByIdExists(id);
    if (response.code !== 200) {
      throw new DeviceException(
        DEVICE_UPDATE_TYPE_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
    return response.object;
  }

  public async getByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.deviceByIdExists(id);
    if (response.code !== 200) {
      throw new DeviceException(
        DEVICE_GET_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    const device = response.object;
    const pos = await this.findMethodsPosUseCase.getById(device.carWashPosId);
    ForbiddenError.from(ability).throwUnlessCan(PermissionAction.read, pos);
  }

  public async getProgramTypeById(id: number): Promise<DeviceProgramType> {
    const response = await this.validateLib.deviceProgramTypeByIdExists(id);
    if (response.code !== 200) {
      throw new DeviceException(
        DEVICE_PROGRAM_TYPE_GET_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
    return response.object;
  }
}
