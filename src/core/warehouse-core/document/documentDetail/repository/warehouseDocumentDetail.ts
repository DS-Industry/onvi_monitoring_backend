import { Injectable } from '@nestjs/common';
import { IWarehouseDocumentDetailRepository } from '@warehouse/document/documentDetail/interface/warehouseDocumentDetail';
import { PrismaService } from '@db/prisma/prisma.service';
import { PrismaWarehouseDocumentDetailMapper } from '@db/mapper/prisma-warehouse-document-detail';
import { WarehouseDocumentDetail } from '@warehouse/document/documentDetail/domain/warehouseDocumentDetail';

@Injectable()
export class WarehouseDocumentDetailRepository extends IWarehouseDocumentDetailRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: WarehouseDocumentDetail,
  ): Promise<WarehouseDocumentDetail> {
    const warehouseDocumentDetailEntity =
      PrismaWarehouseDocumentDetailMapper.toPrisma(input);
    const warehouseDocumentDetail =
      await this.prisma.warehouseDocumentDetail.create({
        data: warehouseDocumentDetailEntity,
      });
    return PrismaWarehouseDocumentDetailMapper.toDomain(
      warehouseDocumentDetail,
    );
  }

  public async createMany(input: WarehouseDocumentDetail[]): Promise<void> {
    const warehouseDocumentDetailEntities = input.map((item) =>
      PrismaWarehouseDocumentDetailMapper.toPrisma(item),
    );
    await this.prisma.warehouseDocumentDetail.createMany({
      data: warehouseDocumentDetailEntities,
    });
  }

  public async findOneById(id: number): Promise<WarehouseDocumentDetail> {
    const warehouseDocumentDetail =
      await this.prisma.warehouseDocumentDetail.findFirst({
        where: {
          id,
        },
      });
    return PrismaWarehouseDocumentDetailMapper.toDomain(
      warehouseDocumentDetail,
    );
  }

  public async findAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<WarehouseDocumentDetail[]> {
    const warehouseDocumentDetails =
      await this.prisma.warehouseDocumentDetail.findMany({
        where: {
          nomenclatureId,
        },
      });
    return warehouseDocumentDetails.map((item) =>
      PrismaWarehouseDocumentDetailMapper.toDomain(item),
    );
  }

  public async findAllByWarehouseDocumentId(
    warehouseDocumentId: number,
  ): Promise<WarehouseDocumentDetail[]> {
    const warehouseDocumentDetails =
      await this.prisma.warehouseDocumentDetail.findMany({
        where: {
          warehouseDocumentId,
        },
      });
    return warehouseDocumentDetails.map((item) =>
      PrismaWarehouseDocumentDetailMapper.toDomain(item),
    );
  }

  public async update(
    input: WarehouseDocumentDetail,
  ): Promise<WarehouseDocumentDetail> {
    const warehouseDocumentDetailEntity =
      PrismaWarehouseDocumentDetailMapper.toPrisma(input);
    const warehouseDocumentDetail =
      await this.prisma.warehouseDocumentDetail.update({
        where: {
          id: input.id,
        },
        data: warehouseDocumentDetailEntity,
      });
    return PrismaWarehouseDocumentDetailMapper.toDomain(
      warehouseDocumentDetail,
    );
  }
}
