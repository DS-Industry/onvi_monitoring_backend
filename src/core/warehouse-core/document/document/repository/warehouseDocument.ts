import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentRepository } from '@warehouse/document/document/interface/warehouseDocument';
import { PrismaService } from '@db/prisma/prisma.service';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { PrismaWarehouseDocumentMapper } from '@db/mapper/prisma-warehouse-document-mapper';
import { WarehouseDocumentType } from '@prisma/client';

@Injectable()
export class WarehouseDocumentRepository extends IWarehouseDocumentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: WarehouseDocument): Promise<WarehouseDocument> {
    const warehouseDocumentEntity =
      PrismaWarehouseDocumentMapper.toPrisma(input);
    const warehouseDocument = await this.prisma.warehouseDocument.create({
      data: warehouseDocumentEntity,
    });
    return PrismaWarehouseDocumentMapper.toDomain(warehouseDocument);
  }

  public async findOneById(id: number): Promise<WarehouseDocument> {
    const warehouseDocument = await this.prisma.warehouseDocument.findFirst({
      where: {
        id,
      },
    });
    return PrismaWarehouseDocumentMapper.toDomain(warehouseDocument);
  }

  public async findAllByWarehouseId(
    warehouseId: number,
  ): Promise<WarehouseDocument[]> {
    const warehouseDocuments = await this.prisma.warehouseDocument.findMany({
      where: {
        warehouseId,
      },
    });
    return warehouseDocuments.map((item) =>
      PrismaWarehouseDocumentMapper.toDomain(item),
    );
  }

  public async findAllByWarehouseIdAndDate(
    warehouseId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<WarehouseDocument[]> {
    const warehouseDocuments = await this.prisma.warehouseDocument.findMany({
      where: {
        warehouseId,
        carryingAt: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        carryingAt: 'asc',
      },
    });
    return warehouseDocuments.map((item) =>
      PrismaWarehouseDocumentMapper.toDomain(item),
    );
  }

  public async findAllByWarehouseIdAndType(
    warehouseId: number,
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]> {
    const warehouseDocuments = await this.prisma.warehouseDocument.findMany({
      where: {
        warehouseId,
        warehouseDocumentType: type,
      },
    });
    return warehouseDocuments.map((item) =>
      PrismaWarehouseDocumentMapper.toDomain(item),
    );
  }

  public async findAllByType(
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]> {
    const warehouseDocuments = await this.prisma.warehouseDocument.findMany({
      where: {
        warehouseDocumentType: type,
      },
    });
    return warehouseDocuments.map((item) =>
      PrismaWarehouseDocumentMapper.toDomain(item),
    );
  }

  public async update(input: WarehouseDocument): Promise<WarehouseDocument> {
    const warehouseDocumentEntity =
      PrismaWarehouseDocumentMapper.toPrisma(input);
    const warehouseDocument = await this.prisma.warehouseDocument.update({
      where: {
        id: input.id,
      },
      data: warehouseDocumentEntity,
    });
    return PrismaWarehouseDocumentMapper.toDomain(warehouseDocument);
  }
}
