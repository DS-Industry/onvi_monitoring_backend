import { Injectable } from '@nestjs/common';
import { ICurrencyRepository } from '@pos/device/device-data/currency/currency/interface/currency';
import { Currency } from '@pos/device/device-data/currency/currency/domain/currency';
import { CurrencyCreateDto } from '@pos/device/device-data/currency/currency/use-case/dto/currency-create.dto';
import { CurrencyType, CurrencyView } from '@prisma/client';

@Injectable()
export class CurrencyCreate {
  constructor(private readonly currencyRepository: ICurrencyRepository) {}

  async execute(input: CurrencyCreateDto): Promise<Currency> {
    //Нужна в app проверка на имя и код
    let currencyType: CurrencyType;
    if (input.curType === 0) {
      currencyType = CurrencyType.CASH;
    } else if (input.curType === 1) {
      currencyType = CurrencyType.CASHLESS;
    } else if (input.curType === 2) {
      currencyType = CurrencyType.VIRTUAL;
    }

    let currencyView = null;
    if (input.curView === 0) {
      currencyView = CurrencyView.COIN;
    } else if (input.curView === 1) {
      currencyView = CurrencyView.PAPER;
    }

    const currencyData = new Currency({
      code: input.code,
      name: input.name,
      currencyType: currencyType,
      currencyView: currencyView,
    });

    return await this.currencyRepository.create(currencyData);
  }
}
