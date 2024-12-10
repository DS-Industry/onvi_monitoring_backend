import { Injectable } from '@nestjs/common';
import {
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import * as XLSX from 'xlsx';
import { NomenclatureUpdateDto } from '@platform-user/validate/validate-rules/dto/nomenclature-update.dto';
import { Nomenclature } from '@warehouse/nomenclature/domain/nomenclature';
import { InventoryItemMonitoringDto } from "@platform-user/validate/validate-rules/dto/inventoryItem-monitoring.dto";

@Injectable()
export class WarehouseValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createWarehouseValidate(
    posId: number,
    managerId: number,
    ability: any,
  ) {
    const response = [];
    const posCheck = await this.validateLib.posByIdExists(posId);
    response.push(posCheck);
    response.push(await this.validateLib.userByIdExists(managerId));
    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
  }

  public async createNomenclatureValidate(
    sku: string,
    name: string,
    organizationId: number,
    categoryId: number,
    ability: any,
    supplierId?: number,
  ) {
    const response = [];
    response.push(await this.validateLib.categoryByIdExists(categoryId));
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);
    response.push(
      await this.validateLib.nomenclatureBySkuAndOrganizationIdNotExists(
        sku,
        organizationId,
      ),
    );
    response.push(
      await this.validateLib.nomenclatureByNameAndOrganizationIdNotExists(
        name,
        organizationId,
      ),
    );
    if (supplierId) {
      response.push(await this.validateLib.supplierByIdExists(supplierId));
    }

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
  }

  public async updateNomenclatureValidate(
    input: NomenclatureUpdateDto,
  ): Promise<Nomenclature> {
    const response: ValidateResponse[] = [];
    const nomenclatureCheck = await this.validateLib.nomenclatureByIdExists(
      input.nomenclatureId,
    );
    response.push(nomenclatureCheck);

    if (nomenclatureCheck.object) {
      const organizationCheck = await this.validateLib.organizationByIdExists(
        nomenclatureCheck.object.organizationId,
      );

      if (input.name && input.name != nomenclatureCheck.object.name) {
        response.push(
          await this.validateLib.nomenclatureByNameAndOrganizationIdNotExists(
            input.name,
            nomenclatureCheck.object.organizationId,
          ),
        );
      }

      if (input.categoryId) {
        response.push(
          await this.validateLib.categoryByIdExists(input.categoryId),
        );
      }

      if (input.supplierId) {
        response.push(
          await this.validateLib.supplierByIdExists(input.supplierId),
        );
      }

      this.validateLib.handlerArrayResponse(response);
      ForbiddenError.from(input.ability).throwUnlessCan(
        PermissionAction.read,
        organizationCheck.object,
      );
      return nomenclatureCheck.object;
    } else {
      this.validateLib.handlerArrayResponse(response);
    }
  }

  public async createNomenclatureFile(file: Express.Multer.File, ability: any) {
    const response = [];

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    /* eslint-disable prettier/prettier */
    const columnMappings = {
      'Наименование': 'name',
      'Артикул': 'sku',
      'Категория': 'category',
      'Организация': 'organization',
    };

    const headers = Object.keys(jsonData[0]);
    jsonData = jsonData.map((row) => {
      const transformedRow = {};
      for (const [originalHeader, newHeader] of Object.entries(
        columnMappings,
      )) {
        transformedRow[newHeader] = row[originalHeader];
      }
      return transformedRow;
    });

    response.push(await this.validateLib.nomenclatureExel(headers, columnMappings))

    const organizations = Array.from(
      new Set(jsonData.map((row) => row.organization)),
    );
    const categories = Array.from(
      new Set(jsonData.map((row) => row.category)),
    );
    const organizationMap = new Map<string, number>();
    const categoriesMap = new Map<string, number>();
    await Promise.all(
      organizations.map(async (item) => {
        const organizationCheck = await this.validateLib.organizationByNameExists(item);
        response.push(organizationCheck);
        if (organizationCheck.object) {
          ForbiddenError.from(ability).throwUnlessCan(
            PermissionAction.read,
            organizationCheck.object
          );
          organizationMap.set(organizationCheck.object.name, organizationCheck.object.id);
        }
      })
    )
    await Promise.all(
      categories.map(async (item) => {
        const categoryCheck = await this.validateLib.categoryByNameExists(item);
        response.push(categoryCheck);
        if (categoryCheck.object) {
          categoriesMap.set(categoryCheck.object.name, categoryCheck.object.id);
        }
      })
    )

    jsonData = jsonData.map((row) => {
      const organizationId = organizationMap.get(row.organization);
      const categoryId = categoriesMap.get(row.category);
      return {
        ...row,
        organizationId,
        categoryId,
      };
    });

    response.push(await this.validateLib.nomenclatureExelOriginalValues(jsonData))
    response.push(await this.validateLib.nomenclatureExelDBOriginalValues(jsonData))

    this.validateLib.handlerArrayResponse(response);
    return jsonData;
  }

  public async createCategoryValidate(categoryId: number) {
    const categoryCheck = await this.validateLib.categoryByIdExists(categoryId);
    if (categoryCheck.code !== 200) {
      throw new Error(`Validation errors: ${categoryCheck.code}`);
    }
  }

  public async getAllByPosId(posId: number, ability: any) {
    const posCheck = await this.validateLib.posByIdExists(posId);
    if (posCheck.code !== 200) {
      throw new Error(`Validation errors: ${posCheck.code}`);
    }
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      posCheck.object,
    );
  }

  public async getOneByIdValidate(id: number, ability: any) {
    const warehouseCheck = await this.validateLib.warehouseByIdExists(id);
    if (warehouseCheck.code !== 200) {
      throw new Error(`Validation errors: ${warehouseCheck.code}`);
    }
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      warehouseCheck.object,
    );
    return warehouseCheck.object;
  }

  public async getAllInventoryItemValidate(input: InventoryItemMonitoringDto) {
    const response = [];

    const organizationCheck =
      await this.validateLib.organizationByIdExists(input.orgId);
    response.push(organizationCheck);
    if (input.categoryId) {
      response.push(
        await this.validateLib.categoryByIdExists(input.categoryId),
      );
    }
    if (input.warehouseId) {
      const warehouseCheck = await this.validateLib.warehouseByIdExists(input.warehouseId);
      response.push(warehouseCheck);
      if (warehouseCheck.object) {
        ForbiddenError.from(input.ability).throwUnlessCan(
          PermissionAction.read,
          warehouseCheck.object,
        );
      }
    }
    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(input.ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
  }
}
