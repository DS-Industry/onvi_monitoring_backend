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
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateWarehouseAbility,
  ReadWarehouseAbility,
  UpdateWarehouseAbility,
} from '@common/decorators/abilities.decorator';
import { WarehouseCreateDto } from '@platform-user/core-controller/dto/receive/warehouse-create.dto';
import { WarehouseValidateRules } from '@platform-user/validate/validate-rules/warehouse-validate-rules';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { NomenclatureCreateDto } from '@platform-user/core-controller/dto/receive/nomenclature-create.dto';
import { CategoryCreateDto } from '@platform-user/core-controller/dto/receive/category-create.dto';
import { CreateCategoryUseCase } from '@warehouse/category/use-cases/category-create';
import { SupplierCreateDto } from '@platform-user/core-controller/dto/receive/supplier-create.dto';
import { CreateSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-create';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-create';
import { NomenclatureUpdateDto } from '@platform-user/core-controller/dto/receive/nomenclature-update.dto';
import { UpdateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-update';
import { FindMethodsCategoryUseCase } from '@warehouse/category/use-cases/category-find-methods';
import { FindMethodsSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-find-methods';
import { InventoryItemMonitoringUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-monitoring';
import { InventoryItemMonitoringDto } from '@platform-user/core-controller/dto/receive/inventoryItem-monitoring.dto';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';
import { WarehouseDocumentCreateDto } from '@platform-user/core-controller/dto/receive/warehouse-document-create.dto';
import { CarryingWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-carrying';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { FindMethodsWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-find-methods';
import { WarehouseDocumentFilterDto } from '@platform-user/core-controller/dto/receive/warehouse-document-filter.dto';
import { AllByFilterWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-all-by-filter';
import { InventoryInventoryItemUseCase } from "@warehouse/inventoryItem/use-cases/inventoryItem-inventory";

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly warehouseValidateRules: WarehouseValidateRules,
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly inventoryItemMonitoringUseCase: InventoryItemMonitoringUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly createNomenclatureUseCase: CreateNomenclatureUseCase,
    private readonly updateNomenclatureUseCase: UpdateNomenclatureUseCase,
    private readonly carryingWarehouseDocumentUseCase: CarryingWarehouseDocumentUseCase,
    private readonly findMethodsCategoryUseCase: FindMethodsCategoryUseCase,
    private readonly findMethodsSupplierUseCase: FindMethodsSupplierUseCase,
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
    private readonly findMethodsWarehouseDocumentDetailUseCase: FindMethodsWarehouseDocumentDetailUseCase,
    private readonly allByFilterWarehouseDocumentUseCase: AllByFilterWarehouseDocumentUseCase,
    private readonly inventoryInventoryItemUseCase: InventoryInventoryItemUseCase,
  ) {}
  //Create warehouse
  @Post()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateWarehouseAbility())
  @HttpCode(201)
  async createWarehouse(
    @Body() data: WarehouseCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      await this.warehouseValidateRules.createWarehouseValidate(
        data.posId,
        data.managerId,
        ability,
      );
      return await this.createWarehouseUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Create nomenclature
  @Post('nomenclature')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async createNomenclature(
    @Request() req: any,
    @Body() data: NomenclatureCreateDto,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      await this.warehouseValidateRules.createNomenclatureValidate(
        data.sku,
        data.name,
        data.organizationId,
        data.categoryId,
        ability,
        data?.supplierId,
      );
      return await this.createNomenclatureUseCase.create(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Patch nomenclature
  @Patch('nomenclature')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async updateNomenclature(
    @Request() req: any,
    @Body() data: NomenclatureUpdateDto,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldNomenclature =
        await this.warehouseValidateRules.updateNomenclatureValidate({
          ...data,
          ability,
        });
      return await this.updateNomenclatureUseCase.execute(
        data,
        oldNomenclature,
        user,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all by OrgId
  @Get('nomenclature/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllNomenclatureByOrgId(
    @Request() req: any,
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getAllNomenclatureByOrgIdValidate(
        orgId,
        ability,
      );
      return await this.findMethodsNomenclatureUseCase.getAllByOrganizationId(
        orgId,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Create nomenclature file
  @Post('nomenclature-file')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createNomenclatureFile(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const data = await this.warehouseValidateRules.createNomenclatureFile(
        file,
        ability,
      );
      await this.createNomenclatureUseCase.createMany(data, user);
      return { status: 'SUCCESS' };
    } catch (e) {
      throw new Error(e);
    }
  }
  //Create category
  @Post('category')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async createCategory(
    @Request() req: any,
    @Body() data: CategoryCreateDto,
  ): Promise<any> {
    try {
      if (data.ownerCategoryId) {
        await this.warehouseValidateRules.createCategoryValidate(
          data.ownerCategoryId,
        );
      }
      return await this.createCategoryUseCase.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all category
  @Get('category')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllCategory(): Promise<any> {
    try {
      return await this.findMethodsCategoryUseCase.getAll();
    } catch (e) {
      throw new Error(e);
    }
  }
  //Create supplier
  @Post('supplier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async createSupplier(
    @Request() req: any,
    @Body() data: SupplierCreateDto,
  ): Promise<any> {
    try {
      return await this.createSupplierUseCase.execute(data.name, data.contact);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all supplier
  @Get('supplier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllSupplier(): Promise<any> {
    try {
      return await this.findMethodsSupplierUseCase.getAll();
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all InventoryItem
  @Get('inventory-item/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllInventoryItem(
    @Request() req: any,
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() params: InventoryItemMonitoringDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getAllInventoryItemValidate({
        orgId,
        ability,
        ...params,
      });
      return await this.inventoryItemMonitoringUseCase.execute({
        orgId,
        ability,
        ...params,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all InventoryItem
  @Get('inventory-item/inventory/:warehouseId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllInventoryItemByWarehouse(
    @Request() req: any,
    @Param('warehouseId', ParseIntPipe) warehouseId: number
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getOneByIdValidate(
        warehouseId,
        ability,
      );
      return await this.inventoryInventoryItemUseCase.execute(warehouseId);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all by PosId
  @Get('pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllByPosId(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getAllByPosId(posId, ability);
      return await this.findMethodsWarehouseUseCase.getAllByPosId(posId);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Create Document
  @Post('document')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async createDocument(
    @Request() req: any,
    @Body() data: WarehouseDocumentCreateDto,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      await this.warehouseValidateRules.createDocumentValidate({
        warehouseId: data.warehouseId,
        responsibleId: data.responsibleId,
        type: data.type,
        ability: ability,
        details: data.details,
      });
      return await this.carryingWarehouseDocumentUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get document and details
  @Get('document/:documentId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getOneDocumentById(
    @Request() req: any,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<any> {
    try {
      const document =
        await this.findMethodsWarehouseDocumentUseCase.getOneById(documentId);
      const documentDetails =
        await this.findMethodsWarehouseDocumentDetailUseCase.getAllByWarehouseDocumentId(
          document.id,
        );
      return { document: document, details: documentDetails };
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all Documents by filter
  @Get('documents')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllDocuments(
    @Request() req: any,
    @Query() params: WarehouseDocumentFilterDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      let warehouse = null;
      if (params.warehouseId) {
        warehouse = await this.warehouseValidateRules.getOneByIdValidate(
          params.warehouseId,
          ability,
        );
      }
      return await this.allByFilterWarehouseDocumentUseCase.execute(
        params.dateStart,
        params.dateEnd,
        ability,
        warehouse,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get by id
  @Get(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getOneById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      return await this.warehouseValidateRules.getOneByIdValidate(id, ability);
    } catch (e) {
      throw new Error(e);
    }
  }
}
