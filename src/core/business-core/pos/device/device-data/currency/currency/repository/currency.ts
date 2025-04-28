import { Injectable } from '@nestjs/common';
import { ICurrencyRepository } from '@pos/device/device-data/currency/currency/interface/currency';
import { PrismaService } from '@db/prisma/prisma.service';
import { Currency } from '@pos/device/device-data/currency/currency/domain/currency';
import { PrismaCurrencyMapper } from '@db/mapper/prisma-currency-mapper';

@Injectable()
export class CurrencyRepository extends ICurrencyRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Currency): Promise<Currency> {
    const currencyEntity = PrismaCurrencyMapper.toPrisma(input);
    const currency = await this.prisma.currency.create({
      data: currencyEntity,
    });
    return PrismaCurrencyMapper.toDomain(currency);
  }

  public async findOneByCode(code: string): Promise<Currency> {
    const currency = await this.prisma.currency.findFirst({
      where: {
        code,
      },
    });
    return PrismaCurrencyMapper.toDomain(currency);
  }

  public async findOneByName(name: string): Promise<Currency> {
    const currency = await this.prisma.currency.findFirst({
      where: {
        name,
      },
    });
    return PrismaCurrencyMapper.toDomain(currency);
  }

  public async findOneById(id: number): Promise<Currency> {
    const currency = await this.prisma.currency.findFirst({
      where: {
        id,
      },
    });
    return PrismaCurrencyMapper.toDomain(currency);
  }

  public async findAll(): Promise<Currency[]> {
    const currencies = await this.prisma.currency.findMany();
    return currencies.map((item) => PrismaCurrencyMapper.toDomain(item));
  }
}
