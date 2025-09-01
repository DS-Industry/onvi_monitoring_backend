import { Injectable } from '@nestjs/common';
import { ISaleItemRepository } from '@warehouse/sale/MNGSaleItem/interface/saleItem';
import { PrismaService } from '@db/prisma/prisma.service';
import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';
import { PrismaSaleItemMapper } from '@db/mapper/prisma-sale-item-mapper';
import { SaleItemResponseDto } from '@warehouse/sale/MNGSaleItem/use-cases/dto/saleItem-response.dto';

@Injectable()
export class SaleItemRepository extends ISaleItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: SaleItem): Promise<SaleItem> {
    const saleItemPrismaEntity = PrismaSaleItemMapper.toPrisma(input);
    const saleItem = await this.prisma.mNGSaleItem.create({
      data: saleItemPrismaEntity,
    });
    return PrismaSaleItemMapper.toDomain(saleItem);
  }

  public async createMany(input: SaleItem[]): Promise<SaleItem[]> {
    const saleItemPrismaEntities = input.map((item) =>
      PrismaSaleItemMapper.toPrisma(item),
    );
    await this.prisma.mNGSaleItem.createMany({
      data: saleItemPrismaEntities,
    });
    return input;
  }

  public async findOneById(id: number): Promise<SaleItem> {
    const saleItem = await this.prisma.mNGSaleItem.findFirst({
      where: {
        id,
      },
    });
    return PrismaSaleItemMapper.toDomain(saleItem);
  }

  public async findAllByFilter(
    nomenclatureId?: number,
    mngSaleDocumentId?: number,
    skip?: number,
    take?: number,
  ): Promise<SaleItemResponseDto[]> {
    const where: any = {};

    if (nomenclatureId !== undefined) {
      where.nomenclatureId = nomenclatureId;
    }

    if (mngSaleDocumentId !== undefined) {
      where.mngSaleDocumentId = mngSaleDocumentId;
    }

    const saleItems = await this.prisma.mNGSaleItem.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        id: 'asc',
      },
      include: {
        nomenclature: true,
      },
    });
    return saleItems.map((item) =>
      PrismaSaleItemMapper.toDomainWhitNomenclatureName(item),
    );
  }

  public async update(input: SaleItem): Promise<SaleItem> {
    const saleItemPrismaEntity = PrismaSaleItemMapper.toPrisma(input);
    const saleItem = await this.prisma.mNGSaleItem.update({
      where: {
        id: input.id,
      },
      data: saleItemPrismaEntity,
    });
    return PrismaSaleItemMapper.toDomain(saleItem);
  }
}
