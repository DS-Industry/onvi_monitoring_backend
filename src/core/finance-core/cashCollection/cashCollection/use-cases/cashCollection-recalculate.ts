import { Injectable } from '@nestjs/common';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';
import { UpdateCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-update';
import { CashCollectionRecalculateDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { UpdateManyCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-update-many';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { UpdateManyCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update-many';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { User } from '@platform-user/user/domain/user';
import { StatusCashCollection } from '@prisma/client';

@Injectable()
export class RecalculateCashCollectionUseCase {
  constructor(
    private readonly updateCashCollectionUseCase: UpdateCashCollectionUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly updateManyCashCollectionDeviceUseCase: UpdateManyCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
    private readonly updateManyCashCollectionTypeUseCase: UpdateManyCashCollectionTypeUseCase,
  ) {}

  async execute(
    data: CashCollectionRecalculateDto,
    devices: CarWashDevice[],
    cashCollection: CashCollection,
    status: StatusCashCollection,
    user: User,
  ): Promise<CashCollectionResponseDto> {
    let sumFactCashCollection = 0;
    let virtualSumCashCollection = 0;
    let shortageCashCollection = 0;
    let carCount = 0;
    let sumCard = 0;
    let sendDate: Date = undefined;

    await this.updateManyCashCollectionDeviceUseCase.execute(
      data.cashCollectionDeviceData,
    );
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollection.id,
      );
    const cashCollectionDeviceResponse = cashCollectionDevices.map(
      (cashDevice) => {
        const matchedDevice = devices.find(
          (device) => device.id === cashDevice.carWashDeviceId,
        );
        carCount += cashDevice.carCount;
        sumCard += cashDevice.sumCard;
        return {
          id: cashDevice.id!,
          deviceId: cashDevice.carWashDeviceId,
          deviceName: matchedDevice.name,
          deviceType: matchedDevice.carWashDeviceTypeName,
          oldTookMoneyTime: cashDevice.oldTookMoneyTime,
          tookMoneyTime: cashDevice.tookMoneyTime,
          sumDevice: cashDevice.sum,
          sumCoinDevice: cashDevice.sumCoin,
          sumPaperDevice: cashDevice.sumPaper,
          virtualSumDevice: cashDevice.virtualSum,
        };
      },
    );

    await this.updateManyCashCollectionTypeUseCase.execute(
      cashCollection.id,
      data.cashCollectionDeviceTypeData,
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

    if (status == StatusCashCollection.SENT) {
      sendDate = new Date(Date.now());
    }

    const cashCollectionUpdate = await this.updateCashCollectionUseCase.execute(
      {
        sendDate: sendDate,
        status: status,
        sumFact: sumFactCashCollection,
        shortage: shortageCashCollection,
        sumCard: sumCard,
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
      status: status,
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
