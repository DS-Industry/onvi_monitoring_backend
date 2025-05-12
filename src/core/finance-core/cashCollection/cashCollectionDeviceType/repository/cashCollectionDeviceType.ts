import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { PrismaService } from '@db/prisma/prisma.service';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';
import { PrismaCashCollectionDeviceTypeMapper } from '@db/mapper/prisma-cash-collection-device-type-mapper';

@Injectable()
export class CashCollectionDeviceTypeRepository extends ICashCollectionDeviceTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType> {
    const cashCollectionDeviceTypeEntity =
      PrismaCashCollectionDeviceTypeMapper.toPrisma(input);
    const cashCollectionDeviceType =
      await this.prisma.cashCollectionDeviceType.create({
        data: cashCollectionDeviceTypeEntity,
      });
    return PrismaCashCollectionDeviceTypeMapper.toDomain(
      cashCollectionDeviceType,
    );
  }

  public async createMany(input: CashCollectionDeviceType[]): Promise<any> {
    const cashCollectionDeviceTypeEntities = input.map((item) =>
      PrismaCashCollectionDeviceTypeMapper.toPrisma(item),
    );
    return this.prisma.cashCollectionDeviceType.createMany({
      data: cashCollectionDeviceTypeEntities,
    });
  }

  public async findOneById(id: number): Promise<CashCollectionDeviceType> {
    const cashCollectionDevice =
      await this.prisma.cashCollectionDeviceType.findFirst({
        where: {
          id,
        },
      });
    return PrismaCashCollectionDeviceTypeMapper.toDomain(cashCollectionDevice);
  }

  public async findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDeviceType[]> {
    const cashCollectionDeviceTypes =
      await this.prisma.cashCollectionDeviceType.findMany({
        where: {
          cashCollectionId,
        },
        include: {
          carWashDeviceType: true,
        },
      });
    return cashCollectionDeviceTypes.map((cashCollectionDeviceType) =>
      PrismaCashCollectionDeviceTypeMapper.toDomain(cashCollectionDeviceType),
    );
  }

  public async update(
    input: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType> {
    const cashCollectionDeviceTypeEntity =
      PrismaCashCollectionDeviceTypeMapper.toPrisma(input);
    const cashCollectionDeviceType =
      await this.prisma.cashCollectionDeviceType.update({
        where: {
          id: input.id,
        },
        data: cashCollectionDeviceTypeEntity,
      });
    return PrismaCashCollectionDeviceTypeMapper.toDomain(
      cashCollectionDeviceType,
    );
  }
}
