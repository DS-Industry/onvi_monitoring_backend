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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

@Injectable()
export class RecalculateCashCollectionUseCase {
  constructor(
    private readonly updateCashCollectionUseCase: UpdateCashCollectionUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly updateManyCashCollectionDeviceUseCase: UpdateManyCashCollectionDeviceUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
    private readonly updateManyCashCollectionTypeUseCase: UpdateManyCashCollectionTypeUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    data: CashCollectionRecalculateDto,
    devices: CarWashDevice[],
    cashCollection: CashCollection,
    status: StatusCashCollection,
    user: User,
  ): Promise<CashCollectionResponseDto> {
    await this.updateManyCashCollectionDeviceUseCase.execute(
      data.cashCollectionDeviceData,
    );
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollection.id,
      );

    const deviceMap = new Map(devices.map((device) => [device.id, device]));
    const { cashCollectionDeviceResponse, carCount, sumCard } =
      this.processDevices(cashCollectionDevices, deviceMap);

    await this.updateManyCashCollectionTypeUseCase.execute(
      cashCollection.id,
      data.cashCollectionDeviceTypeData,
      cashCollectionDevices,
      devices,
    );
    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollection.id,
      );

    const {
      cashCollectionDeviceTypeResponse,
      sumFactCashCollection,
      virtualSumCashCollection,
      shortageCashCollection,
    } = this.processDeviceTypes(cashCollectionDeviceTypes);

    const sendDate =
      status === StatusCashCollection.SENT
        ? this.handleSentStatus(cashCollection, user, sumFactCashCollection)
        : undefined;

    const cashCollectionUpdate = await this.updateCashCollection(
      sumFactCashCollection,
      virtualSumCashCollection,
      shortageCashCollection,
      sumCard,
      carCount,
      status,
      sendDate,
      cashCollection,
      user,
      data.oldCashCollectionDate,
      data.cashCollectionDate,
    );

    return this.buildResponse(
      cashCollectionUpdate,
      cashCollectionDeviceTypeResponse,
      cashCollectionDeviceResponse,
      status,
    );
  }

  private processDevices(
    cashCollectionDevices: CashCollectionDevice[],
    deviceMap: Map<number, CarWashDevice>,
  ): {
    cashCollectionDeviceResponse: any[];
    carCount: number;
    sumCard: number;
  } {
    let carCount = 0;
    let sumCard = 0;

    const cashCollectionDeviceResponse = cashCollectionDevices.map(
      (cashDevice) => {
        const matchedDevice = deviceMap.get(cashDevice.carWashDeviceId);
        carCount += cashDevice.carCount;
        sumCard += cashDevice.sumCard;

        return {
          id: cashDevice.id!,
          deviceId: cashDevice.carWashDeviceId,
          deviceName: matchedDevice?.name || '',
          deviceType: matchedDevice?.carWashDeviceTypeName || '',
          oldTookMoneyTime: cashDevice.oldTookMoneyTime,
          tookMoneyTime: cashDevice.tookMoneyTime,
          sumDevice: cashDevice.sum,
          sumCoinDevice: cashDevice.sumCoin,
          sumPaperDevice: cashDevice.sumPaper,
          virtualSumDevice: cashDevice.virtualSum,
        };
      },
    );

    return { cashCollectionDeviceResponse, carCount, sumCard };
  }

  private processDeviceTypes(
    cashCollectionDeviceTypes: CashCollectionDeviceType[],
  ): {
    cashCollectionDeviceTypeResponse: any[];
    sumFactCashCollection: number;
    virtualSumCashCollection: number;
    shortageCashCollection: number;
  } {
    let sumFactCashCollection = 0;
    let virtualSumCashCollection = 0;
    let shortageCashCollection = 0;

    const cashCollectionDeviceTypeResponse = cashCollectionDeviceTypes.map(
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

    return {
      cashCollectionDeviceTypeResponse,
      sumFactCashCollection,
      virtualSumCashCollection,
      shortageCashCollection,
    };
  }

  private handleSentStatus(
    cashCollection: CashCollection,
    user: User,
    sumFactCashCollection: number,
  ): Date {
    const sendDate = new Date(Date.now());
    this.eventEmitter.emit('manager-paper.created-cash-collection', {
      posId: cashCollection.posId,
      eventDate: cashCollection.cashCollectionDate,
      sum: sumFactCashCollection,
      user: user,
      cashCollectionId: cashCollection.id,
    });
    return sendDate;
  }

  private async updateCashCollection(
    sumFact: number,
    virtualSum: number,
    shortage: number,
    sumCard: number,
    carCount: number,
    status: StatusCashCollection,
    sendDate: Date | undefined,
    cashCollection: CashCollection,
    user: User,
    oldCashCollectionDate: Date | undefined,
    cashCollectionDate: Date | undefined,
  ): Promise<CashCollection> {
    return this.updateCashCollectionUseCase.execute(
      {
        oldCashCollectionDate,
        cashCollectionDate,
        sendDate,
        status,
        sumFact,
        shortage,
        sumCard,
        countCar: carCount,
        averageCheck: carCount > 0 ? (sumFact + virtualSum) / carCount : 0,
        virtualSum,
      },
      cashCollection,
      user,
    );
  }

  private buildResponse(
    cashCollectionUpdate: CashCollection,
    cashCollectionDeviceTypeResponse: any[],
    cashCollectionDeviceResponse: any[],
    status: StatusCashCollection,
  ): CashCollectionResponseDto {
    return {
      id: cashCollectionUpdate.id,
      cashCollectionDate: cashCollectionUpdate.cashCollectionDate,
      oldCashCollectionDate: cashCollectionUpdate.oldCashCollectionDate,
      status,
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
