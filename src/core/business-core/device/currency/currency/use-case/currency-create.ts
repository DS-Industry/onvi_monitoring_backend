import { Injectable } from '@nestjs/common';
import { ICurrencyRepository } from '@device/currency/currency/interface/currency';
import { Currency } from '@device/currency/currency/domain/currency';
import { CurrencyCreateDto } from '@device/currency/currency/use-case/dto/currency-create.dto';
import { CurrencyType, CurrencyView } from '@prisma/client';

@Injectable()
export class CurrencyCreate {
  constructor(private readonly currencyRepository: ICurrencyRepository) {}

  async execute(input: CurrencyCreateDto): Promise<Currency> {
    const currencyCheckCode = await this.currencyRepository.findOneByCode(
      input.code,
    );
    const currencyCheckName = await this.currencyRepository.findOneByName(
      input.name,
    );
    if (currencyCheckCode || currencyCheckName) {
      throw new Error('name or code exists');
    }

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
