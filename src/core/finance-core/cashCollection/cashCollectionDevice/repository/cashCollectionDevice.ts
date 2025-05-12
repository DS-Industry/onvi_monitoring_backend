import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { PrismaService } from '@db/prisma/prisma.service';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { PrismaCashCollectionDeviceMapper } from '@db/mapper/prisma-cash-collection-device-mapper';

@Injectable()
export class CashCollectionDeviceRepository extends ICashCollectionDeviceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: CashCollectionDevice,
  ): Promise<CashCollectionDevice> {
    const cashCollectionDeviceEntity =
      PrismaCashCollectionDeviceMapper.toPrisma(input);
    const cashCollectionDevice = await this.prisma.cashCollectionDevice.create({
      data: cashCollectionDeviceEntity,
    });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }

  public async createMany(input: CashCollectionDevice[]): Promise<any> {
    const cashCollectionDeviceEntities = input.map((item) =>
      PrismaCashCollectionDeviceMapper.toPrisma(item),
    );

    return this.prisma.cashCollectionDevice.createMany({
      data: cashCollectionDeviceEntities,
    });
  }

  public async findOneById(id: number): Promise<CashCollectionDevice> {
    const cashCollectionDevice =
      await this.prisma.cashCollectionDevice.findFirst({
        where: {
          id,
        },
      });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }

  public async findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDevice[]> {
    const cashCollectionDevices =
      await this.prisma.cashCollectionDevice.findMany({
        where: {
          cashCollectionId: cashCollectionId,
        },
      });
    return cashCollectionDevices.map((cashCollectionDevice) =>
      PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice),
    );
  }

  public async update(
    input: CashCollectionDevice,
  ): Promise<CashCollectionDevice> {
    const cashCollectionDeviceEntity =
      PrismaCashCollectionDeviceMapper.toPrisma(input);
    const cashCollectionDevice = await this.prisma.cashCollectionDevice.update({
      where: {
        id: input.id,
      },
      data: cashCollectionDeviceEntity,
    });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }
}
