import { Injectable } from '@nestjs/common';
import { ISaleDocumentRepository } from '@warehouse/sale/MNGSaleDocument/interface/saleDocument';
import { PrismaService } from '@db/prisma/prisma.service';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { PrismaSaleDocumentMapper } from '@db/mapper/prisma-sale-document-mapper';

@Injectable()
export class SaleDocumentRepository extends ISaleDocumentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: SaleDocument): Promise<SaleDocument> {
    const saleDocumentPrismaEntity = PrismaSaleDocumentMapper.toPrisma(input);
    const saleDocument = await this.prisma.mNGSaleDocument.create({
      data: saleDocumentPrismaEntity,
    });
    return PrismaSaleDocumentMapper.toDomain(saleDocument);
  }

  public async findOneById(id: number): Promise<SaleDocument> {
    const saleDocument = await this.prisma.mNGSaleDocument.findFirst({
      where: {
        id,
      },
    });
    return PrismaSaleDocumentMapper.toDomain(saleDocument);
  }

  public async findAllByFilter(
    warehouseId?: number,
    responsibleManagerId?: number,
    dateStartSale?: Date,
    dateEndSale?: Date,
    skip?: number,
    take?: number,
  ): Promise<SaleDocument[]> {
    const where: any = {};

    if (warehouseId !== undefined) {
      where.warehouseId = warehouseId;
    }

    if (responsibleManagerId !== undefined) {
      where.responsibleManagerId = responsibleManagerId;
    }

    if (dateStartSale !== undefined && dateEndSale !== undefined) {
      where.saleDate = {
        gte: dateStartSale,
        lte: dateEndSale,
      };
    }

    const saleDocuments = await this.prisma.mNGSaleDocument.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        saleDate: 'asc',
      },
    });
    return saleDocuments.map((item) => PrismaSaleDocumentMapper.toDomain(item));
  }

  public async update(input: SaleDocument): Promise<SaleDocument> {
    const saleDocumentPrismaEntity = PrismaSaleDocumentMapper.toPrisma(input);
    const saleDocument = await this.prisma.mNGSaleDocument.update({
      where: {
        id: input.id,
      },
      data: saleDocumentPrismaEntity,
    });
    return PrismaSaleDocumentMapper.toDomain(saleDocument);
  }
}
