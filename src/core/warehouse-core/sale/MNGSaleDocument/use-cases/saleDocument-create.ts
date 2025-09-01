import { Injectable } from '@nestjs/common';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { CreateWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-create';
import { SaleDocumentCreateDto } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-create.dto';
import { User } from '@platform-user/user/domain/user';
import moment from 'moment/moment';
import { FindMethodsSaleDocumentUseCase } from '@warehouse/sale/MNGSaleDocument/use-cases/saleDocument-find-methods';
import { ISaleDocumentRepository } from '@warehouse/sale/MNGSaleDocument/interface/saleDocument';
import { CreateSaleItemUseCase } from '@warehouse/sale/MNGSaleItem/use-cases/saleItem-create';
import { WarehouseDocumentType } from '@prisma/client';
import { SandWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-send';
import { SaveWarehouseDocumentUseCase } from '@warehouse/document/document/use-cases/warehouseDocument-save';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindMethodsSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-find-methods';
import { SaleDocumentResponseDto } from "@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-response.dto";

@Injectable()
export class CreateSaleDocumentUseCase {
  constructor(
    private readonly saleDocumentRepository: ISaleDocumentRepository,
    private readonly createSaleItemUseCase: CreateSaleItemUseCase,
    private readonly createWarehouseDocumentUseCase: CreateWarehouseDocumentUseCase,
    private readonly saveWarehouseDocumentUseCase: SaveWarehouseDocumentUseCase,
    private readonly sandWarehouseDocumentUseCase: SandWarehouseDocumentUseCase,
    private readonly findMethodsSaleDocumentUseCase: FindMethodsSaleDocumentUseCase,
    private readonly findMethodsSalePriceUseCase: FindMethodsSalePriceUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    data: SaleDocumentCreateDto,
    user: User,
  ): Promise<SaleDocumentResponseDto> {
    let name = '';
    do {
      name = this.generateName();
    } while (
      (await this.findMethodsSaleDocumentUseCase.getAllByFilter({ name }))
        .length > 0
    );
    const saleDocumentData = new SaleDocument({
      name: name,
      warehouseId: data.warehouse.id,
      responsibleManagerId: data.manager.id,
      saleDate: data.saleDate,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });

    const warehouseDocument = await this.createWarehouseDocumentUseCase.execute(
      WarehouseDocumentType.WRITEOFF,
      user,
    );
    const newWarehouseDocument =
      await this.saveWarehouseDocumentUseCase.execute(
        warehouseDocument,
        {
          warehouseId: data.warehouse.id,
          responsibleId: data.manager.id,
          carryingAt: data.saleDate,
          details: data.items,
        },
        user,
      );
    await this.sandWarehouseDocumentUseCase.execute(
      newWarehouseDocument.newDocument,
      data.items,
      user,
    );

    const saleDocument =
      await this.saleDocumentRepository.create(saleDocumentData);
    const itemsToCreate = data.items.map((item) => ({
      nomenclatureId: item.nomenclatureId,
      count: item.quantity,
      mngSaleDocumentId: saleDocument.id,
      fullSum: item.fullSum,
    }));
    await this.createSaleItemUseCase.executeMany(itemsToCreate);

    let sumSaleDocument = 0;

    for (const item of data.items) {
      const prices = await this.findMethodsSalePriceUseCase.getAllByFilter({
        nomenclatureId: item.nomenclatureId,
        warehouseId: data.warehouse.id,
      });

      const price = prices.length > 0 ? prices[0].price : 0;

      sumSaleDocument += price * item.quantity;
    }

    this.eventEmitter.emit('manager-paper.created-sale-document', {
      posId: data.warehouse.posId,
      eventDate: data.saleDate,
      sum: sumSaleDocument,
      user: data.manager,
    });

    return saleDocument;
  }

  private generateName(): string {
    return 'ПР-' + moment().format('YYMMDDHHmmss');
  }
}
