import { Provider } from "@nestjs/common";
import { ISaleDocumentRepository } from "@warehouse/sale/MNGSaleDocument/interface/saleDocument";
import { SaleDocumentRepository } from "@warehouse/sale/MNGSaleDocument/repository/saleDocument";

export const SaleDocumentRepositoryProvider: Provider = {
  provide: ISaleDocumentRepository,
  useClass: SaleDocumentRepository,
}