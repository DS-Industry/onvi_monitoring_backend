import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';

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

  async getOneById(id: number): Promise<CashCollectionDevice> {
    return await this.cashCollectionDeviceRepository.findOneById(id);
  }
}
