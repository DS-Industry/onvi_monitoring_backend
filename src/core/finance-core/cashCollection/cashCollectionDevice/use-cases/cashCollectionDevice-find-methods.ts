import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CashCollectionDeviceCalculateResponseDto } from '@finance/cashCollection/cashCollectionDevice/use-cases/dto/cashCollectionDevice-calculate-response.dto';

@Injectable()
export class FindMethodsCashCollectionDeviceUseCase {
  constructor(
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
  ) {}

  async getAllByCashCollection(
    cashCollectionId: number,
  ): Promise<CashCollectionDevice[]> {
    return await this.cashCollectionDeviceRepository.findAllByCashCollectionId(
      cashCollectionId,
    );
  }

  async getRecalculateDataByDevice(
    cashCollectionDeviceId: number,
    tookMoneyTime: Date,
    oldTookMoneyTime?: Date,
  ): Promise<CashCollectionDeviceCalculateResponseDto> {
    return await this.cashCollectionDeviceRepository.findRecalculateDataByDevice(
      cashCollectionDeviceId,
      tookMoneyTime,
      oldTookMoneyTime,
    );
  }

  async getOneById(id: number): Promise<CashCollectionDevice> {
    return await this.cashCollectionDeviceRepository.findOneById(id);
  }

  async getCalculateData(
    deviceIds: number[],
  ): Promise<CashCollectionDeviceCalculateResponseDto[]> {
    return await this.cashCollectionDeviceRepository.findCalculateData(
      deviceIds,
    );
  }
}
