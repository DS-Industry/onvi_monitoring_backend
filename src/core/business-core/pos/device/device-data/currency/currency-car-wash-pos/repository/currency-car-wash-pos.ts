import { Injectable } from '@nestjs/common';
import { ICurrencyCarWashPosRepository } from '@pos/device/device-data/currency/currency-car-wash-pos/interface/currency-car-wash-pos';
import { PrismaService } from '@db/prisma/prisma.service';
import { CurrencyCarWashPos } from '@pos/device/device-data/currency/currency-car-wash-pos/domain/currency-car-wash-pos';
import { PrismaCurrencyCarWashPosMapper } from '@db/mapper/prisma-currency-car-wash-pos-mapper';

@Injectable()
export class CurrencyCarWashPosRepository extends ICurrencyCarWashPosRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CurrencyCarWashPos): Promise<CurrencyCarWashPos> {
    const currencyCarWashPosEntity =
      PrismaCurrencyCarWashPosMapper.toPrisma(input);
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.create({
      data: currencyCarWashPosEntity,
    });
    return PrismaCurrencyCarWashPosMapper.toDomain(currencyCarWashPos);
  }

  public async findAllByCarWashDeviceTypeId(
    carWashDeviceTypeId: number,
  ): Promise<CurrencyCarWashPos[]> {
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.findMany({
      where: {
        carWashDeviceTypeId,
      },
    });
    return currencyCarWashPos.map((item) =>
      PrismaCurrencyCarWashPosMapper.toDomain(item),
    );
  }

  public async findAllByCarWashPosId(
    carWashPosId: number,
  ): Promise<CurrencyCarWashPos[]> {
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.findMany({
      where: {
        carWashPosId,
      },
    });
    return currencyCarWashPos.map((item) =>
      PrismaCurrencyCarWashPosMapper.toDomain(item),
    );
  }

  public async findAllByCurrencyId(
    currencyId: number,
  ): Promise<CurrencyCarWashPos[]> {
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.findMany({
      where: {
        currencyId,
      },
    });
    return currencyCarWashPos.map((item) =>
      PrismaCurrencyCarWashPosMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<CurrencyCarWashPos> {
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.findFirst({
      where: {
        id,
      },
    });
    return PrismaCurrencyCarWashPosMapper.toDomain(currencyCarWashPos);
  }

  public async findOneByCarWashPosIdAndCurrencyId(
    carWashPosId: number,
    currencyId: number,
  ): Promise<CurrencyCarWashPos> {
    const currencyCarWashPos = await this.prisma.currencyCarWashPos.findFirst({
      where: {
        carWashPosId,
        currencyId,
      },
    });
    return PrismaCurrencyCarWashPosMapper.toDomain(currencyCarWashPos);
  }
}
