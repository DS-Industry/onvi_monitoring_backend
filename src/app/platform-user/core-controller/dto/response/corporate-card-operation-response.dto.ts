export class CorporateCardOperationResponseDto {
  id: number;
  transactionId: string;
  cardId: number;
  cardUnqNumber: string;
  cardNumber: string;
  ownerName: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  platform: string;
  contractType: string;
  orderData: Date;
  createData: Date;
  orderStatus: string;
  orderHandlerStatus?: string;
  carWashDeviceId: number;
  carWashDeviceName?: string;
}
