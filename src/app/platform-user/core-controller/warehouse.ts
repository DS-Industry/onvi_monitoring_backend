import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { CreateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-create';
import { NomenclatureCreateDto } from '@platform-user/core-controller/dto/receive/nomenclature-create.dto';
import { CategoryCreateDto } from '@platform-user/core-controller/dto/receive/category-create.dto';
import { CreateCategoryUseCase } from '@warehouse/category/use-cases/category-create';
import { SupplierCreateDto } from '@platform-user/core-controller/dto/receive/supplier-create.dto';
import { CreateSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-create';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-create';
import { NomenclatureUpdateDto } from '@platform-user/core-controller/dto/receive/nomenclature-update.dto';
import { UpdateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-update';
import { FindMethodsCategoryUseCase } from "@warehouse/category/use-cases/category-find-methods";
import { FindMethodsSupplierUseCase } from "@warehouse/supplier/use-cases/supplier-find-methods";

@Controller('warehouse')
export class WarehouseController {
  constructor(
    private readonly createWarehouseUseCase: CreateWarehouseUseCase,
    private readonly warehouseValidateRules: WarehouseValidateRules,
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly createInventoryItemUseCase: CreateInventoryItemUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly createNomenclatureUseCase: CreateNomenclatureUseCase,
    private readonly updateNomenclatureUseCase: UpdateNomenclatureUseCase,
    private readonly findMethodsCategoryUseCase: FindMethodsCategoryUseCase,
    private readonly findMethodsSupplierUseCase: FindMethodsSupplierUseCase,
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
