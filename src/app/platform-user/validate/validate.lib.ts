import { Injectable } from '@nestjs/common';
import { FindMethodsCarWashDeviceTypeUseCase } from '@pos/device/deviceType/use-cases/car-wash-device-type-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { ValidateOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-validate';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import {
  PositionUser,
  StatusCashCollection,
  StatusTechTask,
} from '@prisma/client';
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
import { FindMethodsProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-find-methods';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { FindMethodsCategoryUseCase } from '@warehouse/category/use-cases/category-find-methods';
import { Category } from '@warehouse/category/domain/category';
import { FindMethodsSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-find-methods';
import { Supplier } from '@warehouse/supplier/domain/supplier';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import {
  DeviceException,
  FinanceException,
  IncidentException,
  OrganizationException,
  PosException,
  ReportTemplateException,
  TechTaskException,
  UserException,
  WarehouseException,
} from '@exception/option.exceptions';
import { FindMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-find-methods';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { FindMethodsWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-find-methods';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { FindMethodsReportUseCase } from '@report/report/use-cases/report-find-methods';
import { ReportTemplate } from '@report/report/domain/reportTemplate';
import { PosManageUserUseCase } from '@platform-user/user/use-cases/user-pos-manage';
export interface ValidateResponse<T = any> {
  code: number;
  errorMessage?: string;
  object?: T;
}
export enum ExceptionType {
  USER = 'User',
  DEVICE = 'Device',
  INCIDENT = 'Incident',
  ORGANIZATION = 'Organization',
  POS = 'Pos',
  TECH_TASK = 'TechTask',
  WAREHOUSE = 'Warehouse',
  FINANCE = 'Finance',
  REPORT_TEMPLATE = 'ReportTemplate',
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
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
    private readonly findMethodsCategoryUseCase: FindMethodsCategoryUseCase,
    private readonly findMethodsSupplierUseCase: FindMethodsSupplierUseCase,
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
    private readonly findMethodsCashCollectionUseCase: FindMethodsCashCollectionUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly findMethodsWorkDayShiftReportUseCase: FindMethodsWorkDayShiftReportUseCase,
    private readonly findMethodsReportUseCase: FindMethodsReportUseCase,
    private readonly posManageUserUseCase: PosManageUserUseCase,
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
      return {
        code: 400,
        errorMessage: 'Validation error of the verification message',
      };
    }
    return { code: 200, object: confirmMail };
  }
  public async passwordComparison(
    password: string,
    oldPassword: string,
  ): Promise<ValidateResponse> {
    const checkPassword = await this.bcrypt.compare(password, oldPassword);
    if (!checkPassword) {
      return { code: 400, errorMessage: 'Password comparison error' };
    }
    return { code: 200 };
  }
  public async userByIdCheckOwner(id: number): Promise<ValidateResponse<User>> {
    const user = await this.findMethodsUserUseCase.getById(id);
    if (!user || user.position == PositionUser.Owner) {
      return {
        code: 400,
        errorMessage: 'The user does not exist or is the owner',
      };
    }
    return { code: 200 };
  }
  public async roleByIdExists(id: number): Promise<ValidateResponse> {
    const role = await this.findMethodsRoleUseCase.getById(id);
    if (!role) {
      return { code: 400, errorMessage: 'Role not found' };
    }
    return { code: 200 };
  }
  public async userByEmailNotExists(email: string): Promise<ValidateResponse> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (checkUserEmail) {
      return {
        code: 400,
        errorMessage: 'The mail already exists in the system',
      };
    }
    return { code: 200 };
  }
  public async userByEmailExists(email: string): Promise<ValidateResponse> {
    const checkUserEmail = await this.findMethodsUserUseCase.getByEmail(email);
    if (!checkUserEmail) {
      return {
        code: 400,
        errorMessage: 'The mail was not found in the system',
      };
    }
    return { code: 200 };
  }
  public async userByIdExists(id: number): Promise<ValidateResponse<User>> {
    const checkUserId = await this.findMethodsUserUseCase.getById(id);
    if (!checkUserId) {
      return { code: 400, errorMessage: 'The user was not found' };
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
      return {
        code: 400,
        errorMessage: 'The user is not the owner of the organization',
      };
    }
    return { code: 200 };
  }
  public async organizationByDocumentNotExists(
    organizationId: number,
  ): Promise<ValidateResponse> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.organizationDocumentId) {
      return { code: 400, errorMessage: 'The documents already exist' };
    }
    return { code: 200 };
  }
  public async organizationByNameNotExists(
    name: string,
  ): Promise<ValidateResponse<Organization>> {
    const organization =
      await this.findMethodsOrganizationUseCase.getByName(name);
    if (organization) {
      return {
        code: 400,
        errorMessage: 'An organization with that name already exists',
      };
    }
    return { code: 200 };
  }
  public async organizationByNameExists(
    name: string,
  ): Promise<ValidateResponse<Organization>> {
    const organization =
      await this.findMethodsOrganizationUseCase.getByName(name);
    if (!organization) {
      return {
        code: 400,
        errorMessage: 'An organization with that name does not exist',
      };
    }
    return { code: 200, object: organization };
  }
  public async organizationByIdExists(
    organizationId: number,
  ): Promise<ValidateResponse<Organization>> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (!organization) {
      return { code: 400, errorMessage: 'The organization does not exist' };
    }
    return { code: 200, object: organization };
  }
  public async posByNameNotExists(
    name: string,
  ): Promise<ValidateResponse<Pos>> {
    const pos = await this.findMethodsPosUseCase.getByName(name);
    if (pos) {
      return { code: 400, errorMessage: 'A POS with that name exists' };
    }
    return { code: 200 };
  }
  public async posByIdExists(id: number): Promise<ValidateResponse<Pos>> {
    const pos = await this.findMethodsPosUseCase.getById(id);
    if (!pos) {
      return { code: 400, errorMessage: 'POS does not exist' };
    }
    return { code: 200, object: pos };
  }
  public async warehouseByIdExists(
    id: number,
  ): Promise<ValidateResponse<Warehouse>> {
    const warehouse = await this.findMethodsWarehouseUseCase.getById(id);
    if (!warehouse) {
      return { code: 400, errorMessage: 'The warehouse does not exist' };
    }
    return { code: 200, object: warehouse };
  }
  public async categoryByIdExists(
    id: number,
  ): Promise<ValidateResponse<Category>> {
    const category = await this.findMethodsCategoryUseCase.getById(id);
    if (!category) {
      return { code: 400, errorMessage: 'The category does not exist' };
    }
    return { code: 200, object: category };
  }
  public async categoryByNameExists(
    name: string,
  ): Promise<ValidateResponse<Category>> {
    const category = await this.findMethodsCategoryUseCase.getByName(name);
    if (!category) {
      return { code: 400, errorMessage: 'There is no category with that name' };
    }
    return { code: 200, object: category };
  }
  public async supplierByIdExists(
    id: number,
  ): Promise<ValidateResponse<Supplier>> {
    const supplier = await this.findMethodsSupplierUseCase.getById(id);
    if (!supplier) {
      return { code: 400, errorMessage: 'The supplier does not exist' };
    }
    return { code: 200, object: supplier };
  }
  public async nomenclatureBySkuAndOrganizationIdNotExists(
    sku: string,
    organizationId: number,
  ): Promise<ValidateResponse> {
    const nomenclature =
      await this.findMethodsNomenclatureUseCase.getOneBySkuAndOrganizationId(
        sku,
        organizationId,
      );
    if (nomenclature) {
      return {
        code: 400,
        errorMessage: 'There is a nomenclature with such an sku',
      };
    }
    return { code: 200 };
  }
  public async nomenclatureByNameAndOrganizationIdNotExists(
    name: string,
    organizationId: number,
  ): Promise<ValidateResponse> {
    const nomenclature =
      await this.findMethodsNomenclatureUseCase.getOneByNameAndOrganizationId(
        name,
        organizationId,
      );
    if (nomenclature) {
      return {
        code: 400,
        errorMessage: 'There is a nomenclature with this name',
      };
    }
    return { code: 200 };
  }
  public async deviceTypeByNameNotExists(
    name: string,
  ): Promise<ValidateResponse> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByNameWithNull(name);
    if (deviceType) {
      return {
        code: 400,
        errorMessage: 'There is a device type with this name',
      };
    }
    return { code: 200 };
  }
  public async deviceTypeByCodeNotExists(
    code: string,
  ): Promise<ValidateResponse> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getByCodeWithNull(code);
    if (deviceType) {
      return {
        code: 400,
        errorMessage: 'There is a device type with this code',
      };
    }
    return { code: 200 };
  }
  public async deviceTypeByIdExists(
    id: number,
  ): Promise<ValidateResponse<CarWashDeviceType>> {
    const deviceType =
      await this.findMethodsCarWashDeviceTypeUseCase.getById(id);
    if (!deviceType) {
      return { code: 400, errorMessage: 'The device type does not exist' };
    }
    return { code: 200, object: deviceType };
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

  public async nomenclatureExel(
    headers: string[],
    columnMappings: any,
  ): Promise<ValidateResponse> {
    const missingHeaders = Object.keys(columnMappings).filter(
      (header) => !headers.includes(header),
    );
    if (missingHeaders.length > 0) {
      return { code: 400, errorMessage: 'Excel file validation error' };
    }
    return { code: 200 };
  }

  public async nomenclatureExelOriginalValues(
    jsonData: any,
  ): Promise<ValidateResponse> {
    const organizationMap = new Map<
      string,
      { names: Set<string>; skus: Set<string> }
    >();

    for (const row of jsonData) {
      const { organization, name, sku } = row;

      if (!organization || !name || !sku) {
        return { code: 400, errorMessage: 'Excel file validation error' };
      }
      if (!organizationMap.has(organization)) {
        organizationMap.set(organization, {
          names: new Set(),
          skus: new Set(),
        });
      }
      const { names, skus } = organizationMap.get(organization);

      if (names.has(name)) {
        return { code: 400, errorMessage: 'Excel file validation error' };
      }

      if (skus.has(sku)) {
        return { code: 400, errorMessage: 'Excel file validation error' };
      }
      names.add(name);
      skus.add(sku);
    }
    return { code: 200 };
  }

  public async nomenclatureExelDBOriginalValues(
    jsonData: any,
  ): Promise<ValidateResponse> {
    const response = [];

    const organizationMap = new Map<
      number,
      { names: Set<string>; skus: Set<string> }
    >();

    for (const row of jsonData) {
      const { organizationId, name, sku } = row;

      if (!organizationMap.has(organizationId)) {
        organizationMap.set(organizationId, {
          names: new Set(),
          skus: new Set(),
        });
      }

      const { names, skus } = organizationMap.get(organizationId);
      if (!names.has(name)) {
        const nameCheck =
          await this.nomenclatureByNameAndOrganizationIdNotExists(
            name,
            organizationId,
          );
        response.push(nameCheck);
        names.add(name);
      }

      if (!skus.has(sku)) {
        const skuCheck = await this.nomenclatureBySkuAndOrganizationIdNotExists(
          sku,
          organizationId,
        );
        response.push(skuCheck);
        skus.add(sku);
      }
    }

    const failedResponses = response.filter((res) => res.code !== 200);
    if (failedResponses.length > 0) {
      return { code: 400, errorMessage: 'Data error in Excel file' };
    }

    return { code: 200 };
  }

  public async nomenclatureByIdExists(
    nomenclatureId: number,
  ): Promise<ValidateResponse<Nomenclature>> {
    const nomenclature =
      await this.findMethodsNomenclatureUseCase.getOneById(nomenclatureId);
    if (!nomenclature) {
      return { code: 400, errorMessage: 'The nomenclature does not exist' };
    }
    return { code: 200, object: nomenclature };
  }

  public async warehouseDocumentByIdExists(
    id: number,
  ): Promise<ValidateResponse<WarehouseDocument>> {
    const warehouseDocument =
      await this.findMethodsWarehouseDocumentUseCase.getOneById(id);
    if (!warehouseDocument) {
      return {
        code: 400,
        errorMessage: 'The warehouse document does not exist',
      };
    }
    return { code: 200, object: warehouseDocument };
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
      return {
        code: 400,
        errorMessage: 'The device name for POS already exists',
      };
    }
    return { code: 200 };
  }

  public async deviceProgramTypeByIdExists(
    id: number,
  ): Promise<ValidateResponse<DeviceProgramType>> {
    const programType =
      await this.findMethodsDeviceProgramTypeUseCase.getById(id);
    if (!programType) {
      return { code: 400, errorMessage: 'The program type does not exist' };
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
      return { code: 400, errorMessage: 'The program type does not exist' };
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
      return { code: 400, errorMessage: 'POS doesnt have a program type' };
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
      return { code: 400, errorMessage: 'POS doesnt have a program type' };
    }
    return { code: 200 };
  }

  public async incidentNameByIdExists(id: number): Promise<ValidateResponse> {
    const incidentName = await this.findMethodsIncidentNameUseCase.getById(id);
    if (!incidentName) {
      return { code: 400, errorMessage: 'The incident name does not exist' };
    }
    return { code: 200 };
  }

  public async incidentInfoByIdExists(id: number): Promise<ValidateResponse> {
    const incidentInfo = await this.findMethodsIncidentInfoUseCase.getById(id);
    if (!incidentInfo) {
      return { code: 400, errorMessage: 'The incident info does not exist' };
    }
    return { code: 200 };
  }

  public async incidentByIdExists(
    id: number,
  ): Promise<ValidateResponse<Incident>> {
    const incident = await this.findMethodsIncidentUseCase.getById(id);
    if (!incident) {
      return { code: 400, errorMessage: 'The incident does not exist' };
    }
    return { code: 200, object: incident };
  }

  public async itemTemplateByIdExists(id: number): Promise<ValidateResponse> {
    const itemTemplate = await this.findMethodsItemTemplateUseCase.getById(id);
    if (!itemTemplate) {
      return { code: 400, errorMessage: 'The item template does not exist' };
    }
    return { code: 200 };
  }

  public async techTaskByIdExists(
    id: number,
  ): Promise<ValidateResponse<TechTask>> {
    const techTask = await this.findMethodsTechTaskUseCase.getById(id);
    if (!techTask) {
      return { code: 400, errorMessage: 'The tech task does not exist' };
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
      return {
        code: 400,
        errorMessage: 'The technical task does not exist or is not active',
      };
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
      return { code: 400, errorMessage: 'Technical task item error' };
    }
    return { code: 200 };
  }

  public async oldCashCollectionByPosId(
    posId: number,
    cashCollectionData: Date,
  ): Promise<ValidateResponse<CashCollection>> {
    const oldCashCollection =
      await this.findMethodsCashCollectionUseCase.getLastSendByPosId(posId);
    if (oldCashCollection) {
      if (oldCashCollection.cashCollectionDate < cashCollectionData) {
        return { code: 200, object: oldCashCollection };
      } else {
        return {
          code: 400,
          errorMessage: 'Creation date error cashCollection',
        };
      }
    } else {
      return { code: 200 };
    }
  }

  public async cashCollectionByIdExists(
    cashCollectionId: number,
  ): Promise<ValidateResponse<CashCollection>> {
    const cashCollection =
      await this.findMethodsCashCollectionUseCase.getOneById(cashCollectionId);
    if (!cashCollection) {
      return { code: 400, errorMessage: 'The cashCollection does not exist' };
    }
    return { code: 200, object: cashCollection };
  }

  public async cashCollectionRecalculateStatus(
    cashCollection: CashCollection,
  ): Promise<ValidateResponse> {
    if (cashCollection.status == StatusCashCollection.SENT) {
      return {
        code: 400,
        errorMessage: 'The cashCollection can`t be recalculate',
      };
    }
    return { code: 200 };
  }

  public async cashCollectionReturnStatus(
    cashCollection: CashCollection,
  ): Promise<ValidateResponse> {
    if (cashCollection.status != StatusCashCollection.SENT) {
      return {
        code: 400,
        errorMessage: 'The cashCollection can`t be return',
      };
    }
    return { code: 200 };
  }

  public async cashCollectionDeviceComparisonByIdAndList(
    cashCollectionId: number,
    cashCollectionDeviceIds: number[],
  ): Promise<ValidateResponse> {
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollectionId,
      );
    const cashCollectionDeviceIdsCheck = cashCollectionDevices.map(
      (item) => item.id,
    );
    const unnecessaryItems = cashCollectionDeviceIds.filter(
      (item) => !cashCollectionDeviceIdsCheck.includes(item),
    );
    if (unnecessaryItems.length > 0) {
      return { code: 400, errorMessage: 'CashCollectionDevice item error' };
    }
    return { code: 200 };
  }

  public async cashCollectionDeviceTypeComparisonByIdAndList(
    cashCollectionId: number,
    cashCollectionDeviceTypeIds: number[],
  ): Promise<ValidateResponse> {
    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollectionId,
      );
    const cashCollectionDeviceTypeIdsCheck = cashCollectionDeviceTypes.map(
      (item) => item.id,
    );
    const unnecessaryItems = cashCollectionDeviceTypeIds.filter(
      (item) => !cashCollectionDeviceTypeIdsCheck.includes(item),
    );
    if (unnecessaryItems.length > 0) {
      return { code: 400, errorMessage: 'CashCollectionDeviceType item error' };
    }
    return { code: 200 };
  }

  public async shiftReportByIdExists(
    shiftReportId: number,
  ): Promise<ValidateResponse<ShiftReport>> {
    const shiftReport =
      await this.findMethodsShiftReportUseCase.getOneById(shiftReportId);
    if (!shiftReport) {
      return { code: 400, errorMessage: 'The shift report does not exist' };
    }
    return { code: 200, object: shiftReport };
  }

  public async workDayShiftReportByIdExists(
    workDayShiftReportId: number,
  ): Promise<ValidateResponse<WorkDayShiftReport>> {
    const workDayShiftReport =
      await this.findMethodsWorkDayShiftReportUseCase.getOneById(
        workDayShiftReportId,
      );
    if (!workDayShiftReport) {
      return {
        code: 400,
        errorMessage: 'The work day shift report does not exist',
      };
    }
    return { code: 200, object: workDayShiftReport };
  }

  public async reportByIdExists(
    reportId: number,
  ): Promise<ValidateResponse<ReportTemplate>> {
    const report = await this.findMethodsReportUseCase.getOneById(reportId);
    if (!report) {
      return { code: 400, errorMessage: 'The report does not exist' };
    }
    return { code: 200, object: report };
  }

  public async paramsValidate(
    requiredParams: any,
    clientData: any,
  ): Promise<ValidateResponse<any[]>> {
    const missingParams: string[] = [];
    const paramsArray: any[] = [];

    for (const key of Object.keys(requiredParams)) {
      if (!(key in clientData)) {
        missingParams.push(key);
      } else {
        paramsArray.push(clientData[key]);
      }
    }

    if (missingParams.length > 0) {
      return {
        code: 400,
        errorMessage: 'Missing parameters: ' + missingParams.join(', '),
      };
    }
    return { code: 200, object: paramsArray };
  }

  public async posIdAndPermissionsPosIdComparison(
    posIds: number[],
    ability: any,
  ): Promise<ValidateResponse> {
    const permissionPoses = await this.posManageUserUseCase.execute(ability);
    const posIdsCheck = permissionPoses.map((item) => item.id);
    const unnecessaryPos = posIds.filter((item) => !posIdsCheck.includes(item));
    if (unnecessaryPos.length > 0) {
      return { code: 400, errorMessage: 'posId connection error' };
    }
    return { code: 200 };
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
      }
    }
  }
}
