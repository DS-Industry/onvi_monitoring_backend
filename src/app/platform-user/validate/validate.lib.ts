import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser, StatusTechTask } from '@prisma/client';
import { FindMethodsRoleUseCase } from '@platform-user/permissions/user-role/use-cases/role-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { Pos } from '@pos/pos/domain/pos';
import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';
import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';
import { FindMethodsEquipmentKnotUseCase } from '@equipment/equipmentKnot/use-cases/equipment-knot-find-methods';
import { FindMethodsIncidentNameUseCase } from '@equipment/incident/incidentName/use-cases/incident-name-find-methods';
import { FindMethodsIncidentInfoUseCase } from '@equipment/incident/incidentInfo/use-cases/incident-info-find-methods';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { FindMethodsIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-find-methods';
import { Incident } from '@equipment/incident/incident/domain/incident';
import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsProgramTechRateUseCase } from "@tech-task/programTechRate/use-cases/programTechRate-find-methods";
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
    private readonly findMethodsEquipmentKnotUseCase: FindMethodsEquipmentKnotUseCase,
    private readonly findMethodsIncidentUseCase: FindMethodsIncidentUseCase,
    private readonly findMethodsIncidentNameUseCase: FindMethodsIncidentNameUseCase,
    private readonly findMethodsIncidentInfoUseCase: FindMethodsIncidentInfoUseCase,
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly findMethodsProgramTechRateUseCase: FindMethodsProgramTechRateUseCase,
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
  public async userByIdExists(id: number): Promise<ValidateResponse<User>> {
    const checkUserId = await this.findMethodsUserUseCase.getById(id);
    if (!checkUserId) {
      return { code: 450 };
    }
    return { code: 200, object: checkUserId };
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

  public async deviceByNameAndPosIdNotExists(
    posId: number,
    name: string,
  ): Promise<ValidateResponse> {
    const device = await this.findMethodsCarWashDeviceUseCase.getByNameAndCWId(
      posId,
      name,
    );
    if (device) {
      return { code: 481 };
    }
    return { code: 200 };
  }

  public async deviceProgramTypeByIdExists(
    id: number,
  ): Promise<ValidateResponse<DeviceProgramType>> {
    const programType =
      await this.findMethodsDeviceProgramTypeUseCase.getById(id);
    if (!programType) {
      return { code: 482 };
    }
    return { code: 200, object: programType };
  }

  public async programTypeByIdsExists(
    programTypeIds: number[],
  ): Promise<ValidateResponse> {
    const programTypes =
      await this.findMethodsDeviceProgramTypeUseCase.getAll();
    const programTypeIdsCheck = programTypes.map(
      (programType) => programType.id,
    );
    const unnecessaryProgramTypes = programTypeIds.filter(
      (programTypeId) => !programTypeIdsCheck.includes(programTypeId),
    );
    if (unnecessaryProgramTypes.length > 0) {
      return { code: 483 };
    }
    return { code: 200 };
  }

  public async programTypeByIdsAndPosExists(
    programTypeIds: number[],
    posId: number,
  ): Promise<ValidateResponse> {
    const programTypes =
      await this.findMethodsProgramTechRateUseCase.getAllByPosId(posId);
    const programTypeIdsCheck = programTypes.map(
      (programType) => programType.id,
    );
    const unnecessaryProgramTypes = programTypeIds.filter(
      (programTypeId) => !programTypeIdsCheck.includes(programTypeId),
    );
    if (unnecessaryProgramTypes.length > 0) {
      return { code: 483 };
    }
    return { code: 200 };
  }

  public async equipmentKnotByIdExists(
    id: number,
    posId: number,
  ): Promise<ValidateResponse> {
    const equipmentKnot =
      await this.findMethodsEquipmentKnotUseCase.getById(id);
    if (!equipmentKnot || equipmentKnot.posId != posId) {
      return { code: 490 };
    }
    return { code: 200 };
  }

  public async incidentNameByIdExists(id: number): Promise<ValidateResponse> {
    const incidentName = await this.findMethodsIncidentNameUseCase.getById(id);
    if (!incidentName) {
      return { code: 491 };
    }
    return { code: 200 };
  }

  public async incidentInfoByIdExists(id: number): Promise<ValidateResponse> {
    const incidentInfo = await this.findMethodsIncidentInfoUseCase.getById(id);
    if (!incidentInfo) {
      return { code: 492 };
    }
    return { code: 200 };
  }

  public async incidentByIdExists(
    id: number,
  ): Promise<ValidateResponse<Incident>> {
    const incident = await this.findMethodsIncidentUseCase.getById(id);
    if (!incident) {
      return { code: 493 };
    }
    return { code: 200, object: incident };
  }

  public async itemTemplateByIdExists(id: number): Promise<ValidateResponse> {
    const itemTemplate = await this.findMethodsItemTemplateUseCase.getById(id);
    if (!itemTemplate) {
      return { code: 494 };
    }
    return { code: 200 };
  }

  public async techTaskByIdExists(
    id: number,
  ): Promise<ValidateResponse<TechTask>> {
    const techTask = await this.findMethodsTechTaskUseCase.getById(id);
    if (!techTask) {
      return { code: 495 };
    }
    return { code: 200, object: techTask };
  }

  public async techTaskByIdAndStatusExists(
    id: number,
  ): Promise<ValidateResponse<TechTask>> {
    const techTask = await this.findMethodsTechTaskUseCase.getById(id);
    if (
      !techTask ||
      techTask.status == StatusTechTask.FINISHED ||
      techTask.status == StatusTechTask.PAUSE
    ) {
      return { code: 495 };
    }
    return { code: 200, object: techTask };
  }

  public async techTaskItemComparisonByIdAndList(
    id: number,
    itemsIds: number[],
  ): Promise<ValidateResponse> {
    const itemToTechTask =
      await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(id);
    const techTaskItemIds = itemToTechTask.map((item) => item.id);
    const unnecessaryItems = itemsIds.filter(
      (item) => !techTaskItemIds.includes(item),
    );
    if (unnecessaryItems.length > 0) {
      return { code: 496 };
    }
    return { code: 200 };
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
