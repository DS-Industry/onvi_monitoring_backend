import { Injectable } from '@nestjs/common';
import {
  IWarehouseDocumentRepository,
  PaginatedWarehouseDocuments,
} from '@warehouse/document/document/interface/warehouseDocument';
import { PrismaService } from '@db/prisma/prisma.service';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { PrismaWarehouseDocumentMapper } from '@db/mapper/prisma-warehouse-document-mapper';
import { Prisma, WarehouseDocumentType } from '@prisma/client';
import { accessibleBy } from '@casl/prisma';
import { PureAbility } from '@casl/ability';

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
      include: {
        responsible: true,
      },
    });
    return PrismaWarehouseDocumentMapper.toDomain(warehouseDocument);
  }

  public async findOneByName(name: string): Promise<WarehouseDocument> {
    const warehouseDocument = await this.prisma.warehouseDocument.findFirst({
      where: {
        name,
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

  public async getAllByWarehouseIdsAndDate(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  ) {
    const whereClause: Prisma.WarehouseDocumentWhereInput = {
      ...(warehouseId
        ? { warehouseId }
        : {
            AND: [
              {
                warehouse: accessibleBy(ability).Warehouse,
              },
              {
                warehouse: {
                  pos: {
                    placementId: placementId || undefined,
                  },
                },
              },
            ],
          }),
      carryingAt: {
        gte: dateStart,
        lte: dateEnd,
      },
    };

    const skip = page && size ? (page - 1) * size : undefined;
    const take = size || undefined;

    const warehouseDocuments = await this.prisma.warehouseDocument.findMany({
      where: whereClause,
      include: {
        responsible: true,
        warehouse: true,
      },
      orderBy: {
        carryingAt: 'asc',
      },
      skip,
      take,
    });
    return warehouseDocuments.map((item) =>
      PrismaWarehouseDocumentMapper.toDomain(item),
    );
  }

  public async getAllByWarehouseIdsAndDatePaginated(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  ): Promise<PaginatedWarehouseDocuments> {
    const whereClause: Prisma.WarehouseDocumentWhereInput = {
      ...(warehouseId
        ? { warehouseId }
        : {
            AND: [
              {
                warehouse: accessibleBy(ability).Warehouse,
              },
              {
                warehouse: {
                  pos: {
                    placementId: placementId || undefined,
                  },
                },
              },
            ],
          }),
      carryingAt: {
        gte: dateStart,
        lte: dateEnd,
      },
    };

    const skip = page && size ? (page - 1) * size : undefined;
    const take = size || undefined;

    const [warehouseDocuments, total] = await Promise.all([
      this.prisma.warehouseDocument.findMany({
        where: whereClause,
        include: {
          responsible: true,
          warehouse: true,
        },
        orderBy: {
          carryingAt: 'asc',
        },
        skip,
        take,
      }),
      this.prisma.warehouseDocument.count({
        where: whereClause,
      }),
    ]);

    return {
      data: warehouseDocuments.map((item) =>
        PrismaWarehouseDocumentMapper.toDomain(item),
      ),
      total,
    };
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

  public async delete(id: number): Promise<void> {
    await this.prisma.warehouseDocument.delete({ where: { id } });
  }
}
