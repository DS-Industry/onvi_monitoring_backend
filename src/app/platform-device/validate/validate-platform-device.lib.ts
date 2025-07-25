import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { ExceptionType, ValidateResponse } from "@platform-user/validate/validate.lib";
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import {
  DeviceException, FinanceException, HrException,
  IncidentException, LoyaltyException, ManagerPaperException,
  OrganizationException,
  PosException, ReportTemplateException, TechTaskException,
  UserException, WarehouseException
} from "@exception/option.exceptions";

@Injectable()
export class ValidatePlatformDeviceLib {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  public async checkIdDevice(id: number): Promise<number> {
    const device = await this.findMethodsCarWashDeviceUseCase.getById(id);
    if (!device) {
      return 480;
    }
    return 200;
  }

  public async checkNameAndCWIdDevice(
    posId: number,
    name: string,
  ): Promise<number> {
    const device = await this.findMethodsCarWashDeviceUseCase.getByNameAndCWId(
      posId,
      name,
    );
    if (device) {
      return 481;
    }
    return 200;
  }

  public async checkIdTypeDevice(id: number): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return 472;
    }
    return 200;
  }

  public async deviceByIdExists(
    id: number,
  ): Promise<ValidateResponse<CarWashDevice>> {
    const device = await this.findMethodsCarWashDeviceUseCase.getById(id);
    if (!device) {
      return { code: 400, errorMessage: 'The device does not exist' };
    }
    return { code: 200, object: device };
  }

  public async posByIdExists(id: number): Promise<ValidateResponse<Pos>> {
    const pos = await this.findMethodsPosUseCase.getById(id);
    if (!pos) {
      return { code: 400, errorMessage: 'POS does not exist' };
    }
    return { code: 200, object: pos };
  }

  public handlerArrayResponse(
    response: ValidateResponse[],
    exceptionType: ExceptionType,
    exceptionCode: number,
  ) {
    const hasErrors = response.some((response) => response.code !== 200);
    if (hasErrors) {
      const errorCodes = response
        .filter((response) => response.code !== 200)
        .map((response) => response.errorMessage)
        .join('; ');
      if (exceptionType == ExceptionType.USER) {
        throw new UserException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.DEVICE) {
        throw new DeviceException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.INCIDENT) {
        throw new IncidentException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.ORGANIZATION) {
        throw new OrganizationException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.POS) {
        throw new PosException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.TECH_TASK) {
        throw new TechTaskException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.WAREHOUSE) {
        throw new WarehouseException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.FINANCE) {
        throw new FinanceException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.REPORT_TEMPLATE) {
        throw new ReportTemplateException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.LOYALTY) {
        throw new LoyaltyException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.HR) {
        throw new HrException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.NOTIFICATION) {
        throw new HrException(exceptionCode, errorCodes);
      } else if (exceptionType == ExceptionType.MANAGER_PAPER) {
        throw new ManagerPaperException(exceptionCode, errorCodes);
      }
    }
  }
}
