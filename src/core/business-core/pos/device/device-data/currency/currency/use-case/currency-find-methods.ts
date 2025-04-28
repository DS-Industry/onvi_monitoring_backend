import { Injectable } from '@nestjs/common';
import { ICurrencyRepository } from '@pos/device/device-data/currency/currency/interface/currency';
import { Currency } from '@pos/device/device-data/currency/currency/domain/currency';

@Injectable()
export class FindMethodsCurrencyUseCase {
  constructor(private readonly currencyRepository: ICurrencyRepository) {}

  async getById(input: number): Promise<Currency> {
    return await this.currencyRepository.findOneById(input);
  }

  async getAll(): Promise<Currency[]> {
    return await this.currencyRepository.findAll();
  }
}
