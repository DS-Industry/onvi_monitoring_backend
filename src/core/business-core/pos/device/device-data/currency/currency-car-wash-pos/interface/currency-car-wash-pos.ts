import { CurrencyCarWashPos } from '@pos/device/device-data/currency/currency-car-wash-pos/domain/currency-car-wash-pos';

export abstract class ICurrencyCarWashPosRepository {
  abstract create(input: CurrencyCarWashPos): Promise<CurrencyCarWashPos>;
  abstract findOneById(id: number): Promise<CurrencyCarWashPos>;
  abstract findAllByCurrencyId(
    currencyId: number,
  ): Promise<CurrencyCarWashPos[]>;
  abstract findAllByCarWashDeviceTypeId(
    carWashDeviceTypeId: number,
  ): Promise<CurrencyCarWashPos[]>;
  abstract findAllByCarWashPosId(
    carWashPosId: number,
  ): Promise<CurrencyCarWashPos[]>;
  abstract findOneByCarWashPosIdAndCurrencyId(
    carWashPosId: number,
    currencyId: number,
  ): Promise<CurrencyCarWashPos>;
}
