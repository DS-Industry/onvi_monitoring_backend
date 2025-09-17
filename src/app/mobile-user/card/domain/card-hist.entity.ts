export class CardHist {
  constructor(
    public readonly unqCardNumber: string,
    public readonly name: string,
    public readonly phone: string,
    public readonly operDate: Date,
    public readonly operSum: number,
    public readonly operSumReal: number,
    public readonly operSumPoint: number,
    public readonly cashBackAmount: number,
    public readonly orderStatus: string,
    public readonly carWash: string,
    public readonly bay: string,
    public readonly bayType: string,
    public readonly address: string,
    public readonly city: string,
  ) {}

  static fromLTYOrder(order: any): CardHist {
    return new CardHist(
      order.card?.unqNumber || '',
      order.card?.client?.name || '',
      order.card?.client?.phone || '',
      order.orderData,
      order.sumFull,
      order.sumReal,
      order.sumBonus,
      order.sumCashback,
      order.orderStatus,
      order.carWashDevice?.carWasPos?.name || '',
      order.carWashDevice?.name || '',
      order.carWashDevice?.carWashDeviceType?.name || '',
      order.carWashDevice?.carWasPos?.address || '',
      order.carWashDevice?.carWasPos?.city || '',
    );
  }
}
