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
import { InventoryItemMonitoringUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-monitoring';
import { WarehouseDocumentRepositoryProvider } from '@warehouse/document/document/provider/warehouseDocument';
import { WarehouseDocumentDetailRepositoryProvider } from '@warehouse/document/documentDetail/provider/warehouseDocumentDetail';
import { CreateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-create';
import { CarryingWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-carrying';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { CreateWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-create';
import { FindMethodsWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-find-methods';
import { UpdateInventoryItemUseCase } from "@warehouse/inventoryItem/use-cases/inventoryItem-update";
import {
  AllByFilterWarehouseDocumentUseCase,
} from "@warehouse/document/document/use-cases/warehouseDocument-all-by-filter";

const repositories: Provider[] = [
  WarehouseRepositoryProvider,
  InventoryItemRepositoryProvider,
  NomenclatureRepositoryProvider,
  CategoryProvider,
  SupplierRepositoryProvider,
  WarehouseDocumentRepositoryProvider,
  WarehouseDocumentDetailRepositoryProvider,
];

const warehouseUseCase: Provider[] = [
  CreateWarehouseUseCase,
  FindMethodsWarehouseUseCase,
];

const warehouseDocumentUseCase: Provider[] = [
  CreateWarehouseDocumentUseCase,
  CarryingWarehouseDocumentUseCase,
  FindMethodsWarehouseDocumentUseCase,
  AllByFilterWarehouseDocumentUseCase,
];

const warehouseDocumentDetailUseCase: Provider[] = [
  CreateWarehouseDocumentDetailUseCase,
  FindMethodsWarehouseDocumentDetailUseCase,
];

const supplierUseCase: Provider[] = [
  CreateSupplierUseCase,
  FindMethodsSupplierUseCase,
];

const inventoryItemUseCase: Provider[] = [
  CreateInventoryItemUseCase,
  FindMethodsInventoryItemUseCase,
  InventoryItemMonitoringUseCase,
  UpdateInventoryItemUseCase,
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
    ...warehouseDocumentUseCase,
    ...warehouseDocumentDetailUseCase,
  ],
  exports: [
    ...warehouseUseCase,
    ...inventoryItemUseCase,
    ...categoryUseCase,
    ...supplierUseCase,
    ...nomenclatureUseCase,
    ...warehouseDocumentUseCase,
    ...warehouseDocumentDetailUseCase,
  ],
})
export class WarehouseCoreModule {}
