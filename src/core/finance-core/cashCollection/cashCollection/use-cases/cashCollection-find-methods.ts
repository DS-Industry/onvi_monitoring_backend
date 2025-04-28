import { Injectable } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

@Injectable()
export class FindMethodsCashCollectionUseCase {
  constructor(
    private readonly cashCollectionRepository: ICashCollectionRepository,
  ) {}

  async getLastSendByPosId(posId: number): Promise<CashCollection> {
    return await this.cashCollectionRepository.findLastSendByPosId(posId);
  }

  async getOneById(cashCollectionId: number): Promise<CashCollection> {
    return await this.cashCollectionRepository.findOneById(cashCollectionId);
  }

  async getAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollection[]> {
    return await this.cashCollectionRepository.findAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
      skip,
      take,
    );
  }

  async getAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollection[]> {
    return await this.cashCollectionRepository.findAllByPosIdsAndDate(
      posIds,
      dateStart,
      dateEnd,
      skip,
      take,
    );
  }

  async getCountAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return await this.cashCollectionRepository.countAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
    );
  }

  async getCountAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return await this.cashCollectionRepository.countAllByPosIdsAndDate(
      posIds,
      dateStart,
      dateEnd,
    );
  }
}
