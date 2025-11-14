import { StatusCashCollection } from '@prisma/client';
export interface CashCollectionsResponseDto {
  cashCollectionsData: CashCollectionsDataResponseDto[];
  totalCount: number;
}
export interface CashCollectionsDataResponseDto {
  id: number;
  posId: number;
  oldCashCollectionDate: Date;
  cashCollectionDate: Date;
  sumFact: number;
  sumCard: number;
  sumVirtual: number;
  profit: number;
  status: StatusCashCollection;
  shortage: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
  cashCollectionDeviceType: CashCollectionDeviceTypeResponseDto[];
}

export interface CashCollectionDeviceTypeResponseDto {
  typeName: string;
  typeShortage: number;
}
