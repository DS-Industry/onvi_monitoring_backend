import { StatusCashCollection } from '@prisma/client';

export class CashCollectionUpdateDto {
  oldCashCollectionDate?: Date;
  cashCollectionDate?: Date;
  sendDate?: Date;
  status?: StatusCashCollection;
  sumFact?: number;
  shortage?: number;
  sumCard?: number;
  countCar?: number;
  averageCheck?: number;
  virtualSum?: number;
}
