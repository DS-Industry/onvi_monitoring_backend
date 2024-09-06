import { CurrencyType } from '@prisma/client';

export class PosGetSumByCutTypeAndDateDto {
  currencyType: CurrencyType;
  posId: number;
  dateStart: Date;
  dateEnd: Date;
}
