import { Injectable } from '@nestjs/common';
import { ICurrencyRepository } from '@device/currency/currency/interface/currency';
import { Currency } from '@device/currency/currency/domain/currency';

@Injectable()
export class GetByIdCurrencyUseCase {
  constructor(private readonly currencyRepository: ICurrencyRepository) {}

  async execute(input: number): Promise<Currency> {
    const currency = await this.currencyRepository.findOneById(input);
    if (!currency) {
      throw new Error('currency not exists');
    }
    return currency;
  }
}
