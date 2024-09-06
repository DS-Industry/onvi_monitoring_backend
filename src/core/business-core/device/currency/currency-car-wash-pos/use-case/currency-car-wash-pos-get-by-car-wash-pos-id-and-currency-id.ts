import { Injectable } from '@nestjs/common';
import { ICurrencyCarWashPosRepository } from '@device/currency/currency-car-wash-pos/interface/currency-car-wash-pos';
import { CurrencyCarWashPos } from '@device/currency/currency-car-wash-pos/domain/currency-car-wash-pos';

@Injectable()
export class GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase {
  constructor(
    private readonly currencyCarWashPosRepository: ICurrencyCarWashPosRepository,
  ) {}

  async execute(
    currencyId: number,
    carWashPosId: number,
  ): Promise<CurrencyCarWashPos> {
    return await this.currencyCarWashPosRepository.findOneByCarWashPosIdAndCurrencyId(
      carWashPosId,
      currencyId,
    );
  }
}
