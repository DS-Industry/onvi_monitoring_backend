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
    const now = new Date();
    const cashCollection = await this.cashCollectionRepository.create(
      new CashCollection({
        cashCollectionDate: data.cashCollectionDate,
        posId: data.posId,
        status: StatusCashCollection.CREATED,
        createdAt: now,
        updatedAt: now,
        createdById: user.id,
        updatedById: user.id,
      }),
    );
    const { carCount, sumCard } =
      await this.createManyCashCollectionDeviceUseCase.execute(
        cashCollection.id,
        devices,
        oldCashCollection?.id,
      );
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollection.id,
      );
    const deviceMap = new Map(devices.map((d) => [d.id, d]));
    const cashCollectionDeviceResponse = cashCollectionDevices.map(
      (cashDevice) => {
        const matchedDevice = deviceMap.get(cashDevice.carWashDeviceId);
        return {
          id: cashDevice.id!,
          deviceId: cashDevice.carWashDeviceId,
          deviceName: matchedDevice?.name,
          deviceType: matchedDevice?.carWashDeviceTypeName,
          oldTookMoneyTime: cashDevice.oldTookMoneyTime,
          tookMoneyTime: cashDevice.tookMoneyTime,
          sumDevice: cashDevice.sum,
          sumCoinDevice: cashDevice.sumCoin,
          sumPaperDevice: cashDevice.sumPaper,
          virtualSumDevice: cashDevice.virtualSum,
        };
      },
    );

    let sumFactCashCollection = 0;
    let virtualSumCashCollection = 0;
    let shortageCashCollection = 0;
    console.log(new Date());
    await this.createManyCashCollectionTypeUseCase.execute(
      cashCollection.id,
      cashCollectionDevices,
      devices,
    );
    const cashCollectionDeviceType =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollection.id,
      );

    const cashCollectionDeviceTypeResponse = cashCollectionDeviceType.map(
      (cashDeviceType) => {
        sumFactCashCollection += cashDeviceType.sumFact;
        virtualSumCashCollection += cashDeviceType.virtualSum;
        shortageCashCollection += cashDeviceType.shortage;
        return {
          id: cashDeviceType.id,
          typeName: cashDeviceType.carWashDeviceTypeName,
          sumCoinDeviceType: cashDeviceType.sumCoin,
          sumPaperDeviceType: cashDeviceType.sumPaper,
          sumFactDeviceType: cashDeviceType.sumFact,
          shortageDeviceType: cashDeviceType.shortage,
          virtualSumDeviceType: cashDeviceType.virtualSum,
        };
      },
    );

    const cashCollectionUpdate = await this.updateCashCollectionUseCase.execute(
      {
        oldCashCollectionDate:
          oldCashCollection?.cashCollectionDate ||
          cashCollectionDevices[0]?.oldTookMoneyTime,
        status: StatusCashCollection.SAVED,
        sumFact: sumFactCashCollection,
        shortage: shortageCashCollection,
        sumCard,
        countCar: carCount,
        averageCheck:
          (sumFactCashCollection + virtualSumCashCollection) / carCount,
        virtualSum: virtualSumCashCollection,
      },
      cashCollection,
      user,
    );
    return {
      id: cashCollectionUpdate.id,
      cashCollectionDate: cashCollectionUpdate.cashCollectionDate,
      oldCashCollectionDate: cashCollectionUpdate.oldCashCollectionDate,
      status: cashCollectionUpdate.status,
      sumFact: cashCollectionUpdate.sumFact,
      virtualSum: cashCollectionUpdate.virtualSum,
      sumCard: cashCollectionUpdate.sumCard,
      shortage: cashCollectionUpdate.shortage,
      countCar: cashCollectionUpdate.countCar,
      averageCheck: cashCollectionUpdate.averageCheck,
      cashCollectionDeviceType: cashCollectionDeviceTypeResponse,
      cashCollectionDevice: cashCollectionDeviceResponse,
    };
  }
}
