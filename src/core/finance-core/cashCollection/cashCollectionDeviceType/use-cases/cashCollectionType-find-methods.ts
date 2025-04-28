import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

@Injectable()
export class FindMethodsCashCollectionTypeUseCase {
  constructor(
    private readonly cashCollectionDeviceTypeRepository: ICashCollectionDeviceTypeRepository,
  ) {}

  async getAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDeviceType[]> {
    return await this.cashCollectionDeviceTypeRepository.findAllByCashCollectionId(
      cashCollectionId,
    );
  }
}
