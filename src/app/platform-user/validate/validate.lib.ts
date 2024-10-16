import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser } from '@prisma/client';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { Pos } from '@pos/pos/domain/pos';
import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
export interface ValidateResponse<T = any> {
  code: number;
  object?: T;
}
@Injectable()
export class ValidateLib {
  constructor(
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
    private readonly validateOrganizationMail: ValidateOrganizationConfirmMailUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  public async workerConfirmMailExists(
    email: string,
    confirmString: string,
  ): Promise<ValidateResponse<number>> {
    const confirmMail = await this.validateOrganizationMail.execute(
      email,
      confirmString,
    );
    if (!confirmMail) {
      return { code: 440 };
    }
    return { code: 200, object: confirmMail };
  }
  public async passwordComparison(
    password: string,
    oldPassword: string,
  ): Promise<ValidateResponse> {
    const checkPassword = await this.bcrypt.compare(password, oldPassword);
    if (!checkPassword) {
      return { code: 441 };
    }
    return { code: 200 };
  }
  public async userByIdCheckOwner(id: number): Promise<ValidateResponse<User>> {
    const user = await this.findMethodsUserUseCase.getById(id);
    if (!user || user.position == PositionUser.Owner) {
      return { code: 443 };
    }
    return { code: 200 };
  }
  public async roleByIdExists(id: number): Promise<ValidateResponse> {
    const role = await this.findMethodsRoleUseCase.getById(id);
    if (!role) {
      return { code: 444 };
    }
    return { code: 200 };
  }
  public async userByEmailNotExists(email: string): Promise<ValidateResponse> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (checkUserEmail) {
      return { code: 450 };
    }
    return { code: 200 };
  }
  public async userByEmailExists(email: string): Promise<ValidateResponse> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (!checkUserEmail) {
      return { code: 450 };
    }
    return { code: 200 };
  }
  public async organizationByOwnerExists(
    organizationId: number,
    userId: number,
  ): Promise<ValidateResponse> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.ownerId !== userId) {
      return { code: 451 };
    }
    return { code: 200 };
  }
  public async organizationByDocumentNotExists(
    organizationId: number,
  ): Promise<ValidateResponse> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.organizationDocumentId) {
      return { code: 452 };
    }
    return { code: 200 };
  }
  public async organizationByNameNotExists(
    name: string,
  ): Promise<ValidateResponse<Organization>> {
    const organization =
      await this.findMethodsOrganizationUseCase.getByName(name);
    if (organization) {
      return { code: 453 };
    }
    return { code: 200 };
  }
  public async organizationByIdExists(
    organizationId: number,
  ): Promise<ValidateResponse<Organization>> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (!organization) {
      return { code: 454 };
    }
    return { code: 200, object: organization };
  }
  public async posByNameNotExists(
    name: string,
  ): Promise<ValidateResponse<Pos>> {
    const pos = await this.findMethodsPosUseCase.getByName(name);
    if (pos) {
      return { code: 463 };
    }
    return { code: 200 };
  }
  public async posByIdExists(id: number): Promise<ValidateResponse<Pos>> {
    const pos = await this.findMethodsPosUseCase.getById(id);
    if (!pos) {
      return { code: 464 };
    }
    return { code: 200, object: pos };
  }
  public async deviceTypeByNameNotExists(
    name: string,
  ): Promise<ValidateResponse> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByNameWithNull(name);
    if (deviceType) {
      return { code: 470 };
    }
    return { code: 200 };
  }
  public async deviceTypeByCodeNotExists(
    code: string,
  ): Promise<ValidateResponse> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByCodeWithNull(code);
    if (deviceType) {
      return { code: 471 };
    }
    return { code: 200 };
  }
  public async deviceTypeByIdExists(
    id: number,
  ): Promise<ValidateResponse<CarWashDeviceType>> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return { code: 472 };
    }
    return { code: 200, object: deviceType };
  }
  public async deviceByIdExists(
    id: number,
  ): Promise<ValidateResponse<CarWashDevice>> {
    const device = await this.findMethodsCarWashDeviceUseCase.getById(id);
    if (!device) {
      return { code: 473 };
    }
    return { code: 200, object: device };
  }

  public handlerArrayResponse(response: ValidateResponse[]) {
    const hasErrors = response.some((response) => response.code !== 200);
    if (hasErrors) {
      const errorCodes = response
        .filter((response) => response.code !== 200)
        .map((response) => response.code)
        .join(', ');
      throw new Error(`Validation errors: ${errorCodes}`);
    }
  }
}
