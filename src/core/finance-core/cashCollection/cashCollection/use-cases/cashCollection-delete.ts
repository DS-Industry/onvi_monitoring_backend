import { Injectable } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';

@Injectable()
export class DeleteCashCollectionUseCase {
  constructor(
    private readonly cashCollectionRepository: ICashCollectionRepository,
  ) {}

  async execute(input: CashCollection): Promise<void> {
    await this.cashCollectionRepository.delete(input.id);
  }
}
