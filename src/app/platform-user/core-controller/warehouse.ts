import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  DeleteWarehouseAbility,
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
import { SandWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-send';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { FindMethodsWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-find-methods';
import { WarehouseDocumentFilterDto } from '@platform-user/core-controller/dto/receive/warehouse-document-filter.dto';
import { AllByFilterWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-all-by-filter';
import { InventoryInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-inventory';
import { WarehouseDocumentSaveDto } from '@platform-user/core-controller/dto/receive/warehouse-document-save.dto';
import { CreateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-create';
import { SaveWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-save';
import {
  WarehouseDomainException,
  WarehouseException,
} from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { UpdateCategoryUseCase } from '@warehouse/category/use-cases/category-update';
import { CategoryUpdateDto } from '@platform-user/core-controller/dto/receive/category-update.dto';
import { Category } from '@warehouse/category/domain/category';
import { PlacementFilterDto } from '@platform-user/core-controller/dto/receive/placement-pos-filter.dto';
import { WarehousePaginatedResponseDto } from '@platform-user/core-controller/dto/response/warehouse-paginated-response.dto';
import { WarehousePaginatedFilterDto } from '@platform-user/core-controller/dto/receive/warehouse-paginated-filter.dto';
import { DestinyNomenclature, NomenclatureStatus } from '@prisma/client';
import { PaginationDto } from '@platform-user/core-controller/dto/receive/pagination.dto';
import { NomenclatureFilterDto } from '@platform-user/core-controller/dto/receive/nomenclature-filter.dto';
import { SupplierGetAllDto } from '@platform-user/core-controller/dto/receive/supplier-get-all.dto';
import { PurposeType } from '@warehouse/nomenclature/interface/nomenclatureMeta';
import { SaleInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-sale';
import { InventoryItemSaleResponseDto } from '@warehouse/inventoryItem/use-cases/dto/inventoryItem-sale-response.dto';
import { DeleteCategoryUseCase } from '@warehouse/category/use-cases/category-delete';
import { DeleteSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-delete';
import { UpdateSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-update';
import { SupplierUpdateDto } from '@platform-user/core-controller/dto/receive/supplier-update.dto';
import { Supplier } from '@warehouse/supplier/domain/supplier';
import { DeleteWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-delete';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly warehouseValidateRules: WarehouseValidateRules,
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
    private readonly inventoryItemMonitoringUseCase: InventoryItemMonitoringUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly createNomenclatureUseCase: CreateNomenclatureUseCase,
    private readonly updateNomenclatureUseCase: UpdateNomenclatureUseCase,
    private readonly sandWarehouseDocumentUseCase: SandWarehouseDocumentUseCase,
    private readonly saveWarehouseDocumentUseCase: SaveWarehouseDocumentUseCase,
    private readonly findMethodsCategoryUseCase: FindMethodsCategoryUseCase,
    private readonly findMethodsSupplierUseCase: FindMethodsSupplierUseCase,
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
    private readonly findMethodsWarehouseDocumentUseCase: FindMethodsWarehouseDocumentUseCase,
    private readonly findMethodsWarehouseDocumentDetailUseCase: FindMethodsWarehouseDocumentDetailUseCase,
    private readonly allByFilterWarehouseDocumentUseCase: AllByFilterWarehouseDocumentUseCase,
    private readonly inventoryInventoryItemUseCase: InventoryInventoryItemUseCase,
    private readonly createWarehouseDocumentUseCase: CreateWarehouseDocumentUseCase,
    private readonly saleInventoryItemUseCase: SaleInventoryItemUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly deleteWarehouseDocumentUseCase: DeleteWarehouseDocumentUseCase,
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create nomenclature
  @Post('nomenclature')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createNomenclature(
    @Request() req: any,
    @Body() data: NomenclatureCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.warehouseValidateRules.createNomenclatureValidate(
        data.sku,
        data.name,
        data.organizationId,
        data.categoryId,
        data?.supplierId,
      );
      let destiny: DestinyNomenclature = DestinyNomenclature.INTERNAL;
      if (data.metaData.purpose == PurposeType.SALE) {
        destiny = DestinyNomenclature.SALE;
      }

      return await this.createNomenclatureUseCase.create(
        { ...data, destiny },
        user,
        file,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Patch nomenclature
  @Patch('nomenclature')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async updateNomenclature(
    @Request() req: any,
    @Body() data: NomenclatureUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldNomenclature =
        await this.warehouseValidateRules.updateNomenclatureValidate({
          ...data,
          ability,
        });
      let destiny: DestinyNomenclature;
      if (data.metaData.purpose) {
        if (data.metaData.purpose == PurposeType.SALE) {
          destiny = DestinyNomenclature.SALE;
        } else {
          destiny = DestinyNomenclature.INTERNAL;
        }
      }
      return await this.updateNomenclatureUseCase.execute(
        { ...data, destiny },
        oldNomenclature,
        user,
        file,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Delete nomenclature
  @Delete('nomenclature/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteWarehouseAbility())
  @HttpCode(201)
  async deleteNomenclature(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldNomenclature =
        await this.warehouseValidateRules.deleteNomenclatureValidate(
          id,
          ability,
        );
      return await this.updateNomenclatureUseCase.execute(
        { status: NomenclatureStatus.DELETED },
        oldNomenclature,
        user,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all by OrgId
  @Get('nomenclature/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllNomenclatureByOrgId(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() params: NomenclatureFilterDto,
  ): Promise<any> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      await this.warehouseValidateRules.getAllNomenclatureByOrgIdValidate(
        orgId,
      );
      return await this.findMethodsNomenclatureUseCase.getAllByFilter({
        organizationId: orgId,
        status: NomenclatureStatus.ACTIVE,
        skip: skip,
        take: take,
        search: params.search,
      });
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('nomenclature-sale/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllNomenclatureForSale(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() params: PaginationDto,
  ): Promise<any> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      await this.warehouseValidateRules.getAllNomenclatureByOrgIdValidate(
        orgId,
      );
      return await this.findMethodsNomenclatureUseCase.getAllByFilter({
        organizationId: orgId,
        destiny: DestinyNomenclature.SALE,
        skip: skip,
        take: take,
      });
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('nomenclature-count/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getCountAllNomenclatureByOrgId(
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<{ count: number }> {
    try {
      await this.warehouseValidateRules.getAllNomenclatureByOrgIdValidate(
        orgId,
      );
      const count =
        await this.findMethodsNomenclatureUseCase.getCountAllByFilter({
          organizationId: orgId,
          status: NomenclatureStatus.ACTIVE,
        });
      return { count };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      const { user } = req;
      const data = await this.warehouseValidateRules.createNomenclatureFile(
        file,
      );
      await this.createNomenclatureUseCase.createMany(data, user);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update category
  @Patch('category/:categoryId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() data: CategoryUpdateDto,
  ): Promise<Category> {
    try {
      const category =
        await this.warehouseValidateRules.updateCategoryValidate(categoryId);
      return await this.updateCategoryUseCase.execute(data, category);
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Delete('category/:categoryId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<{ status: string }> {
    try {
      const category =
        await this.warehouseValidateRules.updateCategoryValidate(categoryId);
      await this.deleteCategoryUseCase.execute(category.id);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Patch('supplier/:supplierId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async updateSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() data: SupplierUpdateDto,
  ): Promise<Supplier> {
    try {
      const supplier =
        await this.warehouseValidateRules.updateSupplierValidate(supplierId);
      return await this.updateSupplierUseCase.execute(data, supplier);
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Delete('supplier/:supplierId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async deleteSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<{ status: string }> {
    try {
      const category =
        await this.warehouseValidateRules.updateSupplierValidate(supplierId);
      await this.deleteSupplierUseCase.execute(category.id);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('supplier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllSupplier(@Query() params: SupplierGetAllDto): Promise<any> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return await this.findMethodsSupplierUseCase.getAll(
        params?.name,
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('supplier-count')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getCountAllSupplier(): Promise<{ count: number }> {
    try {
      return await this.findMethodsSupplierUseCase.getCountAll();
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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

      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }

      await this.warehouseValidateRules.getAllInventoryItemValidate({
        orgId,
        ability,
        ...params,
      });
      return await this.inventoryItemMonitoringUseCase.execute({
        orgId,
        ability,
        skip,
        take,
        ...params,
      });
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('inventory-item-count/:orgId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getCountAllInventoryItem(
    @Request() req: any,
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() params: InventoryItemMonitoringDto,
  ): Promise<{ count: number }> {
    try {
      const { ability } = req;

      await this.warehouseValidateRules.getAllInventoryItemValidate({
        orgId,
        ability,
        ...params,
      });

      let warehouses: Warehouse[] = [];

      if (params.warehouseId) {
        warehouses.push(
          await this.findMethodsWarehouseUseCase.getById(params.warehouseId),
        );
      } else {
        warehouses = await this.findMethodsWarehouseUseCase.geyAllByPermission(
          ability,
          params.placementId,
        );
      }

      const count =
        await this.findMethodsInventoryItemUseCase.getCountByWarehouseIdsForInventory(
          {
            warehouseIds: warehouses.map((w) => w.id),
            organizationId: orgId,
            categoryId: params.categoryId,
            status: NomenclatureStatus.ACTIVE,
          },
        );
      return { count };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all InventoryItem
  @Get('inventory-item/inventory/:warehouseId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllInventoryItemByWarehouse(
    @Request() req: any,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getOneByIdValidate(
        warehouseId,
        ability,
      );
      return await this.inventoryInventoryItemUseCase.execute(warehouseId);
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('inventory-item/sale/:warehouseId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllInventoryItemBySale(
    @Request() req: any,
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
  ): Promise<InventoryItemSaleResponseDto[]> {
    try {
      const { ability } = req;
      await this.warehouseValidateRules.getOneByIdValidate(
        warehouseId,
        ability,
      );
      return await this.saleInventoryItemUseCase.execute(warehouseId);
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all
  @Get('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllByPosId(
    @Request() req: any,
    @Query() params: PlacementFilterDto,
  ): Promise<any> {
    try {
      const { ability } = req;

      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }

      if (params.posId) {
        await this.warehouseValidateRules.getAllByPosId(params.posId);
        return await this.findMethodsWarehouseUseCase.getAllByPosId(
          params.posId,
          skip,
          take,
        );
      } else {
        return await this.findMethodsWarehouseUseCase.geyAllByPermission(
          ability,
          params?.placementId,
          skip,
          take,
        );
      }
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('paginated')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getAllByPosIdPaginated(
    @Request() req: any,
    @Query() params: WarehousePaginatedFilterDto,
  ): Promise<WarehousePaginatedResponseDto> {
    try {
      const { ability } = req;

      const page = params.page || 1;
      const size = params.size || 10;
      const skip = size * (page - 1);
      const take = size;

      const [data, { count: total }] = await Promise.all([
        this.findMethodsWarehouseUseCase.getAllByOrganizationId(
          params.organizationId,
          ability,
          params.posId,
          skip,
          take,
        ),
        this.findMethodsWarehouseUseCase.getCountAllByOrganizationId(
          params.organizationId,
          ability,
          params.posId,
        ),
      ]);

      const totalPages = Math.ceil(total / size);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      return {
        data,
        total,
        page,
        size,
        totalPages,
        hasNext,
        hasPrevious,
      };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('count')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(200)
  async getCountAllByPosId(
    @Request() req: any,
    @Query() params: PlacementFilterDto,
  ): Promise<{ count: number }> {
    try {
      const { ability } = req;

      if (params.posId) {
        await this.warehouseValidateRules.getAllByPosId(params.posId);
        return await this.findMethodsWarehouseUseCase.getCountAllByPosId(
          params.posId,
        );
      } else {
        return await this.findMethodsWarehouseUseCase.getCountAllByPermission(
          ability,
          params?.placementId,
        );
      }
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create Document
  @Post('document')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateWarehouseAbility())
  @HttpCode(201)
  async createDocument(
    @Request() req: any,
    @Body() data: WarehouseDocumentCreateDto,
  ): Promise<any> {
    try {
      const { user } = req;
      return await this.createWarehouseDocumentUseCase.execute(data.type, user);
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Delete('document/:documentId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateWarehouseAbility())
  @HttpCode(201)
  async deleteDocument(
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<{ status: string }> {
    try {
      const oldDocument =
        await this.warehouseValidateRules.deleteDocumentValidate(documentId);
      await this.deleteWarehouseDocumentUseCase.execute(oldDocument.id);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else if (e instanceof WarehouseDomainException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Save Document
  @Post('document/save/:documentId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateWarehouseAbility())
  @HttpCode(201)
  async saveDocument(
    @Request() req: any,
    @Body() data: WarehouseDocumentSaveDto,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldDocument =
        await this.warehouseValidateRules.saveDocumentValidate({
          warehouseDocumentId: documentId,
          warehouseId: data.warehouseId,
          responsibleId: data?.responsibleId,
          ability: ability,
          details: data?.details,
        });
      const response = await this.saveWarehouseDocumentUseCase.execute(
        oldDocument,
        data,
        user,
      );
      return { status: response.status };
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Send Document
  @Post('document/send/:documentId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateWarehouseAbility())
  @HttpCode(201)
  async sendDocument(
    @Request() req: any,
    @Body() data: WarehouseDocumentSaveDto,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldDocument =
        await this.warehouseValidateRules.saveDocumentValidate({
          warehouseDocumentId: documentId,
          warehouseId: data.warehouseId,
          responsibleId: data.responsibleId,
          ability: ability,
          details: data.details,
        });
      const document = await this.saveWarehouseDocumentUseCase.execute(
        oldDocument,
        data,
        user,
      );
      return await this.sandWarehouseDocumentUseCase.execute(
        document.newDocument,
        data.details,
        user,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else if (e instanceof WarehouseDomainException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
        params.placementId,
        warehouse,
        params.page,
        params.size,
      );
    } catch (e) {
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
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
      if (e instanceof WarehouseException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
