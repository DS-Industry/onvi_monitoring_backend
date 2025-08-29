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
import { SandWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-send';
import { FindMethodsWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-find-methods';
import { CreateWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-create';
import { FindMethodsWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-find-methods';
import { UpdateInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-update';
import { AllByFilterWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-all-by-filter';
import { InventoryInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-inventory';
import { FileModule } from '@libs/file/module';
import { SaveWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-save';
import { DeleteWarehouseDocumentDetailUseCase } from '@warehouse/document/documentDetail/use-cases/warehouseDocumentDetail-delete';
import { UpdateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-update';
import { UpdateCategoryUseCase } from '@warehouse/category/use-cases/category-update';
import { SaleDocumentRepositoryProvider } from '@warehouse/sale/MNGSaleDocument/provider/saleDocument';
import { SaleItemRepositoryProvider } from '@warehouse/sale/MNGSaleItem/provider/saleItem';
import { SalePriceRepositoryProvider } from '@warehouse/sale/MNGSalePrice/provider/salePrice';
import { CreateSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-create';
import { FindMethodsSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-find-methods';
import { UpdateSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-update';
import { CreateSaleItemUseCase } from '@warehouse/sale/MNGSaleItem/use-cases/saleItem-create';
import { FindMethodsSaleItemUseCase } from '@warehouse/sale/MNGSaleItem/use-cases/saleItem-find-methods';
import { CreateSaleDocumentUseCase } from '@warehouse/sale/MNGSaleDocument/use-cases/saleDocument-create';
import { FindMethodsSaleDocumentUseCase } from '@warehouse/sale/MNGSaleDocument/use-cases/saleDocument-find-methods';
import { SaleInventoryItemUseCase } from "@warehouse/inventoryItem/use-cases/inventoryItem-sale";
import { DeleteCategoryUseCase } from "@warehouse/category/use-cases/category-delete";
import { DeleteSupplierUseCase } from "@warehouse/supplier/use-cases/supplier-delete";
import { UpdateSupplierUseCase } from "@warehouse/supplier/use-cases/supplier-update";
import { DeleteWarehouseDocumentUseCase } from "@warehouse/document/document/use-cases/warehouseDocument-delete";
import { DeleteSalePriceUseCase } from "@warehouse/sale/MNGSalePrice/use-cases/salePrice-delete";

const repositories: Provider[] = [
  WarehouseRepositoryProvider,
  InventoryItemRepositoryProvider,
  NomenclatureRepositoryProvider,
  CategoryProvider,
  SupplierRepositoryProvider,
  WarehouseDocumentRepositoryProvider,
  WarehouseDocumentDetailRepositoryProvider,
  SaleDocumentRepositoryProvider,
  SaleItemRepositoryProvider,
  SalePriceRepositoryProvider,
];

const warehouseUseCase: Provider[] = [
  CreateWarehouseUseCase,
  FindMethodsWarehouseUseCase,
];

const warehouseDocumentUseCase: Provider[] = [
  CreateWarehouseDocumentUseCase,
  SandWarehouseDocumentUseCase,
  SaveWarehouseDocumentUseCase,
  FindMethodsWarehouseDocumentUseCase,
  AllByFilterWarehouseDocumentUseCase,
  UpdateWarehouseDocumentUseCase,
  DeleteWarehouseDocumentUseCase,
];

const warehouseDocumentDetailUseCase: Provider[] = [
  CreateWarehouseDocumentDetailUseCase,
  DeleteWarehouseDocumentDetailUseCase,
  FindMethodsWarehouseDocumentDetailUseCase,
];

const supplierUseCase: Provider[] = [
  CreateSupplierUseCase,
  FindMethodsSupplierUseCase,
  DeleteSupplierUseCase,
  UpdateSupplierUseCase,
];

const inventoryItemUseCase: Provider[] = [
  CreateInventoryItemUseCase,
  FindMethodsInventoryItemUseCase,
  InventoryItemMonitoringUseCase,
  UpdateInventoryItemUseCase,
  InventoryInventoryItemUseCase,
  SaleInventoryItemUseCase,
];

const categoryUseCase: Provider[] = [
  CreateCategoryUseCase,
  FindMethodsCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
];

const nomenclatureUseCase: Provider[] = [
  CreateNomenclatureUseCase,
  UpdateNomenclatureUseCase,
  FindMethodsNomenclatureUseCase,
];

const salePriceUseCase: Provider[] = [
  CreateSalePriceUseCase,
  FindMethodsSalePriceUseCase,
  UpdateSalePriceUseCase,
  DeleteSalePriceUseCase,
];

const saleItemUseCase: Provider[] = [
  CreateSaleItemUseCase,
  FindMethodsSaleItemUseCase,
];

const saleDocumentUseCase: Provider[] = [
  CreateSaleDocumentUseCase,
  FindMethodsSaleDocumentUseCase,
];

@Module({
  imports: [PrismaModule, FileModule],
  providers: [
    ...repositories,
    ...warehouseUseCase,
    ...supplierUseCase,
    ...inventoryItemUseCase,
    ...categoryUseCase,
    ...nomenclatureUseCase,
    ...warehouseDocumentUseCase,
    ...warehouseDocumentDetailUseCase,
    ...salePriceUseCase,
    ...saleItemUseCase,
    ...saleDocumentUseCase,
  ],
  exports: [
    ...warehouseUseCase,
    ...inventoryItemUseCase,
    ...categoryUseCase,
    ...supplierUseCase,
    ...nomenclatureUseCase,
    ...warehouseDocumentUseCase,
    ...warehouseDocumentDetailUseCase,
    ...salePriceUseCase,
    ...saleItemUseCase,
    ...saleDocumentUseCase,
  ],
})
export class WarehouseCoreModule {}
