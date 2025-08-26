import { Injectable } from '@nestjs/common';
import { ISaleDocumentRepository } from '@warehouse/sale/MNGSaleDocument/interface/saleDocument';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';

@Injectable()
export class FindMethodsSaleDocumentUseCase {
  constructor(
    private readonly saleDocumentRepository: ISaleDocumentRepository,
  ) {}

  async getOneById(id: number): Promise<SaleDocument> {
    return await this.saleDocumentRepository.findOneById(id);
  }

  async getAllByFilter(data: {
    name?: string,
    warehouseId?: number;
    responsibleManagerId?: number;
    dateStartSale?: Date;
    dateEndSale?: Date;
    skip?: number;
    take?: number;
  }): Promise<SaleDocument[]> {
    return await this.saleDocumentRepository.findAllByFilter(
      data.name,
      data.warehouseId,
      data.responsibleManagerId,
      data.dateStartSale,
      data.dateEndSale,
      data.skip,
      data.take,
    );
  }
}
