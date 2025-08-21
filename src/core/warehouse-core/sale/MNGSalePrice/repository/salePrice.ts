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

  public async createMany(input: SalePrice[]): Promise<SalePrice[]> {
    const salePricePrismaEntities = input.map((item) =>
      PrismaSalePriceMapper.toPrisma(item),
    );
    await this.prisma.mNGSalePrice.createMany({
      data: salePricePrismaEntities,
    });
    return input;
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

  public async updateMany(input: SalePrice[]): Promise<void> {
    const updates = input.map((item) => {
      return this.prisma.mNGSalePrice.update({
        where: { id: item.id },
        data: PrismaSalePriceMapper.toPrisma(item),
      });
    });

    await this.prisma.$transaction(updates);
  }

  public async updateValue(id: number, price: number): Promise<SalePrice> {
    const salePrice = await this.prisma.mNGSalePrice.update({
      where: {
        id: id,
      },
      data: { price: price },
    });
    return PrismaSalePriceMapper.toDomain(salePrice);
  }
}
