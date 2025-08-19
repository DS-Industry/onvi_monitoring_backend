import { Injectable } from '@nestjs/common';
import { ISalePriceRepository } from '@warehouse/sale/MNGSalePrice/interface/salePrice';
import { PrismaService } from '@db/prisma/prisma.service';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { PrismaSalePriceMapper } from '@db/mapper/prisma-sale-price-mapper';

@Injectable()
export class SalePriceRepository extends ISalePriceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: SalePrice): Promise<SalePrice> {
    const salePricePrismaEntity = PrismaSalePriceMapper.toPrisma(input);
    const salePrice = await this.prisma.mNGSalePrice.create({
      data: salePricePrismaEntity,
    });
    return PrismaSalePriceMapper.toDomain(salePrice);
  }

  public async findOneById(id: number): Promise<SalePrice> {
    const salePrice = await this.prisma.mNGSalePrice.findFirst({
      where: {
        id,
      },
    });
    return PrismaSalePriceMapper.toDomain(salePrice);
  }

  public async findAllByFilter(
    nomenclatureId?: number,
    warehouseId?: number,
    skip?: number,
    take?: number,
  ): Promise<SalePrice[]> {
    const where: any = {};

    if (warehouseId !== undefined) {
      where.warehouseId = warehouseId;
    }

    if (nomenclatureId !== undefined) {
      where.nomenclatureId = nomenclatureId;
    }

    const salePrices = await this.prisma.mNGSalePrice.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        id: 'asc',
      },
    });
    return salePrices.map((item) => PrismaSalePriceMapper.toDomain(item));
  }

  public async update(input: SalePrice): Promise<SalePrice> {
    const salePricePrismaEntity = PrismaSalePriceMapper.toPrisma(input);
    const salePrice = await this.prisma.mNGSalePrice.update({
      where: {
        id: input.id,
      },
      data: salePricePrismaEntity,
    });
    return PrismaSalePriceMapper.toDomain(salePrice);
  }
}
