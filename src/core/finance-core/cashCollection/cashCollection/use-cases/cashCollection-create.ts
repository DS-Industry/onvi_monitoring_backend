import { Injectable } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';
import { CashCollectionCreateDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-create.dto';
import { StatusCashCollection } from '@prisma/client';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { User } from '@platform-user/user/domain/user';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CreateManyCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-create-many';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { CreateManyCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-create-many';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { UpdateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-update';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

@Injectable()
export class CreateCashCollectionUseCase {
  constructor(
    private readonly cashCollectionRepository: ICashCollectionRepository,
    private readonly createManyCashCollectionDeviceUseCase: CreateManyCashCollectionDeviceUseCase,
    private readonly createManyCashCollectionTypeUseCase: CreateManyCashCollectionTypeUseCase,
    private readonly updateCashCollectionUseCase: UpdateCashCollectionUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
  ) {}

  async execute(
    data: CashCollectionCreateDto,
    devices: CarWashDevice[],
    user: User,
    oldCashCollection: CashCollection,
  ): Promise<CashCollectionResponseDto> {
    const cashCollection = await this.cashCollectionRepository.create(
      new CashCollection({
        cashCollectionDate: data.cashCollectionDate,
        posId: data.posId,
        status: StatusCashCollection.CREATED,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        createdById: user.id,
        updatedById: user.id,
      }),
    );

    const { carCount, sumCard } =
      await this.createManyCashCollectionDeviceUseCase.execute(
        cashCollection.id,
        devices,
      );
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollection.id,
      );

    await this.createManyCashCollectionTypeUseCase.execute(
      cashCollection.id,
      cashCollectionDevices,
      devices,
    );
    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollection.id,
      );

    const { sumFact, virtualSum, shortage } = cashCollectionDeviceTypes.reduce(
      (acc, curr) => ({
        sumFact: acc.sumFact + curr.sumFact,
        virtualSum: acc.virtualSum + curr.virtualSum,
        shortage: acc.shortage + curr.shortage,
      }),
      { sumFact: 0, virtualSum: 0, shortage: 0 },
    );

    const cashCollectionUpdate = await this.updateCashCollectionUseCase.execute(
      {
        oldCashCollectionDate:
          oldCashCollection?.cashCollectionDate ||
          cashCollectionDevices[0]?.oldTookMoneyTime,
        status: StatusCashCollection.SAVED,
        sumFact: sumFact,
        shortage: shortage,
        sumCard,
        countCar: carCount,
        averageCheck: (sumFact + virtualSum) / carCount,
        virtualSum: virtualSum,
      },
      cashCollection,
      user,
    );

    return this.buildCashCollectionResponse(
      cashCollectionUpdate,
      cashCollectionDevices,
      devices,
      cashCollectionDeviceTypes,
      sumFact,
      virtualSum,
      shortage,
      sumCard,
      carCount,
    );
  }

  private buildCashCollectionResponse(
    cashCollection: CashCollection,
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
    cashCollectionDeviceTypes: CashCollectionDeviceType[],
    sumFact: number,
    virtualSum: number,
    shortage: number,
    sumCard: number,
    carCount: number,
  ): CashCollectionResponseDto {
    const deviceMap = new Map(devices.map((d) => [d.id, d]));
    const cashCollectionDeviceResponse = cashCollectionDevices.map(
      (cashDevice) => ({
        id: cashDevice.id!,
        deviceId: cashDevice.carWashDeviceId,
        deviceName: deviceMap.get(cashDevice.carWashDeviceId)?.name,
        deviceType: deviceMap.get(cashDevice.carWashDeviceId)
          ?.carWashDeviceTypeName,
        oldTookMoneyTime: cashDevice.oldTookMoneyTime,
        tookMoneyTime: cashDevice.tookMoneyTime,
        sumDevice: cashDevice.sum,
        sumCoinDevice: cashDevice.sumCoin,
        sumPaperDevice: cashDevice.sumPaper,
        virtualSumDevice: cashDevice.virtualSum,
      }),
    );

    const cashCollectionDeviceTypeResponse = cashCollectionDeviceTypes.map(
      (cashDeviceType) => ({
        id: cashDeviceType.id,
        typeName: cashDeviceType.carWashDeviceTypeName,
        sumCoinDeviceType: cashDeviceType.sumCoin,
        sumPaperDeviceType: cashDeviceType.sumPaper,
        sumFactDeviceType: cashDeviceType.sumFact,
        shortageDeviceType: cashDeviceType.shortage,
        virtualSumDeviceType: cashDeviceType.virtualSum,
      }),
    );

    const averageCheck = carCount > 0 ? (sumFact + virtualSum) / carCount : 0;

    return {
      id: cashCollection.id,
      cashCollectionDate: cashCollection.cashCollectionDate,
      oldCashCollectionDate:
        cashCollection.oldCashCollectionDate ||
        cashCollectionDevices[0]?.oldTookMoneyTime,
      status: cashCollection.status,
      sumFact,
      virtualSum,
      sumCard,
      shortage,
      countCar: carCount,
      averageCheck,
      cashCollectionDeviceType: cashCollectionDeviceTypeResponse,
      cashCollectionDevice: cashCollectionDeviceResponse,
    };
  }
}
