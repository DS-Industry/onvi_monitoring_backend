import { Injectable } from '@nestjs/common';
import { ValidatePlatformDeviceLib } from '@platform-device/validate/validate-platform-device.lib';
import { ExceptionType } from '@platform-user/validate/validate.lib';
import { Pos } from '@pos/pos/domain/pos';
import { DEVICE_GET_BY_ID_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class DeviceValidateRules {
  constructor(
    private readonly validatePlatformDeviceLib: ValidatePlatformDeviceLib,
  ) {}

  public async createValidate(typeId: number, posId: number, name: string) {
    const response = [];
    response.push(
      await this.validatePlatformDeviceLib.checkIdTypeDevice(typeId),
    );
    response.push(
      await this.validatePlatformDeviceLib.checkNameAndCWIdDevice(posId, name),
    );

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }
  public async getByIdValidate(id: number) {
    const response = await this.validatePlatformDeviceLib.checkIdDevice(id);
    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async cardBalanceValidate(deviceId: number): Promise<Pos> {
    const response = [];
    const deviceCheck =
      await this.validatePlatformDeviceLib.deviceByIdExists(deviceId);
    response.push(deviceCheck);
    if (deviceCheck.object) {
      const posCheck = await this.validatePlatformDeviceLib.posByIdExists(
        deviceCheck.object.carWashPosId,
      );
      response.push(posCheck);

      this.validatePlatformDeviceLib.handlerArrayResponse(
        response,
        ExceptionType.DEVICE,
        DEVICE_GET_BY_ID_EXCEPTION_CODE,
      );
      return posCheck.object;
    }
    this.validatePlatformDeviceLib.handlerArrayResponse(
      response,
      ExceptionType.DEVICE,
      DEVICE_GET_BY_ID_EXCEPTION_CODE,
    );
  }
}
