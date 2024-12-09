import { Module, Provider } from '@nestjs/common';
import { WarehouseRepositoryProvider } from '@warehouse/warehouse/provider/warehouse';
import { PrismaModule } from '@db/prisma/prisma.module';
import { InventoryItemRepositoryProvider } from '@warehouse/inventoryItem/provider/inventoryItem';
import { CategoryProvider } from '@warehouse/category/provider/category';
import { SupplierRepositoryProvider } from '@warehouse/supplier/provider/supplier';
import { CreateWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-create';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import { FindMethodsSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-find-methods';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { FindMethodsCategoryUseCase } from '@warehouse/category/use-cases/category-find-methods';
import { CreateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-create';
import { CreateCategoryUseCase } from '@warehouse/category/use-cases/category-create';
import { CreateSupplierUseCase } from '@warehouse/supplier/use-cases/supplier-create';
import { NomenclatureRepositoryProvider } from '@warehouse/nomenclature/provider/nomenclature';
import { CreateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-create';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';
import { UpdateNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-update';

const repositories: Provider[] = [
  WarehouseRepositoryProvider,
  InventoryItemRepositoryProvider,
  NomenclatureRepositoryProvider,
  CategoryProvider,
  SupplierRepositoryProvider,
];

const warehouseUseCase: Provider[] = [
  CreateWarehouseUseCase,
  FindMethodsWarehouseUseCase,
];

const supplierUseCase: Provider[] = [
  CreateSupplierUseCase,
  FindMethodsSupplierUseCase,
];

const inventoryItemUseCase: Provider[] = [
  CreateInventoryItemUseCase,
  FindMethodsInventoryItemUseCase,
];

const categoryUseCase: Provider[] = [
  CreateCategoryUseCase,
  FindMethodsCategoryUseCase,
];

const nomenclatureUseCase: Provider[] = [
  CreateNomenclatureUseCase,
  UpdateNomenclatureUseCase,
  FindMethodsNomenclatureUseCase,
];

@Module({
  imports: [PrismaModule],
  providers: [
    ...repositories,
    ...warehouseUseCase,
    ...supplierUseCase,
    ...inventoryItemUseCase,
    ...categoryUseCase,
    ...nomenclatureUseCase,
  ],
  exports: [
    ...warehouseUseCase,
    ...inventoryItemUseCase,
    ...categoryUseCase,
    ...supplierUseCase,
    ...nomenclatureUseCase,
  ],
})
export class WarehouseCoreModule {}
