import { Injectable } from '@nestjs/common';
import { ISaleDocumentRepository } from '@warehouse/sale/MNGSaleDocument/interface/saleDocument';
import { PrismaService } from '@db/prisma/prisma.service';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { PrismaSaleDocumentMapper } from '@db/mapper/prisma-sale-document-mapper';
import { SaleDocumentResponseDto } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-response.dto';

@Injectable()
export class SaleDocumentRepository extends ISaleDocumentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: SaleDocument): Promise<SaleDocumentResponseDto> {
    const saleDocumentPrismaEntity = PrismaSaleDocumentMapper.toPrisma(input);
    const saleDocument = await this.prisma.mNGSaleDocument.create({
      data: saleDocumentPrismaEntity,
      include: {
        warehouse: true,
        responsibleManager: true,
      },
    });
    return PrismaSaleDocumentMapper.toDomainWithData(saleDocument);
  }

  public async findOneById(id: number): Promise<SaleDocumentResponseDto> {
    const saleDocument = await this.prisma.mNGSaleDocument.findFirst({
      where: {
        id,
      },
      include: {
        warehouse: true,
        responsibleManager: true,
      },
    });
    return PrismaSaleDocumentMapper.toDomainWithData(saleDocument);
  }

  public async findAllByFilter(
    name?: string,
    warehouseId?: number,
    responsibleManagerId?: number,
    dateStartSale?: Date,
    dateEndSale?: Date,
    skip?: number,
    take?: number,
  ): Promise<SaleDocumentResponseDto[]> {
    const where: any = {};

    if (name !== undefined) {
      where.name = name;
    }

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
      include: {
        warehouse: true,
        responsibleManager: true,
      },
    });
    return saleDocuments.map((item) =>
      PrismaSaleDocumentMapper.toDomainWithData(item),
    );
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
