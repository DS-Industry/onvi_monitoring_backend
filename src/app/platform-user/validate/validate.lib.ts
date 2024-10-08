import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { IBcryptAdapter } from "@libs/bcrypt/adapter";
import { PositionUser } from "@prisma/client";
import { FindMethodsRoleUseCase } from "@platform-user/permissions/user-role/use-cases/role-find-methods";

@Injectable()
export class ValidateLib {
  constructor(
    private readonly findMethodsCarWashDeviceTypeUseCase: FindMethodsCarWashDeviceTypeUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsRoleUseCase: FindMethodsRoleUseCase,
    private readonly validateOrganizationMail: ValidateOrganizationConfirmMailUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  public async workerConfirmMailExists(
    email: string,
    confirmString: string,
  ): Promise<number> {
    const confirmMail = await this.validateOrganizationMail.execute(
      email,
      confirmString,
    );
    if (!confirmMail) {
      return 440;
    }
    return 200;
  }
  public async passwordComparison(
    password: string,
    oldPassword: string,
  ): Promise<number> {
    const checkPassword = await this.bcrypt.compare(password, oldPassword);
    if (!checkPassword) {
      return 441;
    }
    return 200;
  }
  public async userByIdExists(id: number): Promise<number> {
    const user = await this.findMethodsUserUseCase.getById(id);
    if (!user) {
      return 442;
    }
    return 200;
  }
  public async userByIdCheckOwner(id: number): Promise<number> {
    const user = await this.findMethodsUserUseCase.getById(id);
    if (!user || user.position == PositionUser.Owner) {
      return 443;
    }
    return 200;
  }
  public async roleByIdExists(id: number): Promise<number> {
    const role = await this.findMethodsRoleUseCase.getById(id);
    if (!role) {
      return 444;
    }
    return 200;
  }
  public async userByEmailNotExists(email: string): Promise<number> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (checkUserEmail) {
      return 450;
    }
    return 200;
  }
  public async userByEmailExists(email: string): Promise<number> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (!checkUserEmail) {
      return 450;
    }
    return 200;
  }
  public async organizationByOwnerExists(
    organizationId: number,
    userId: number,
  ): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.ownerId !== userId) {
      return 451;
    }
    return 200;
  }
  public async organizationByDocumentNotExists(
    organizationId: number,
  ): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.organizationDocumentId) {
      return 452;
    }
    return 200;
  }
  public async organizationByNameNotExists(name: string): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getByName(name);
    if (organization) {
      return 453;
    }
    return 200;
  }
  public async organizationByIdExists(organizationId: number): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (!organization) {
      return 454;
    }
    return 200;
  }
  public async posByNameNotExists(name: string): Promise<number> {
    const pos = await this.findMethodsPosUseCase.getByName(name);
    if (pos) {
      return 463;
    }
    return 200;
  }
  public async posByIdExists(id: number): Promise<number> {
    const pos = await this.findMethodsPosUseCase.getById(id);
    if (!pos) {
      return 464;
    }
    return 200;
  }
  public async deviceTypeByNameNotExists(name: string): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByNameWithNull(name);
    if (deviceType) {
      return 470;
    }
    return 200;
  }
  public async deviceTypeByCodeNotExists(code: string): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByCodeWithNull(code);
    if (deviceType) {
      return 471;
    }
    return 200;
  }
  public async deviceTypeByIdExists(id: number): Promise<number> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return 472;
    }
    return 200;
  }
}
