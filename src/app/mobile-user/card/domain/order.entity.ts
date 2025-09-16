import { LTYOrder, LTYCard, CarWashDevice } from '@prisma/client';

export class Order {
  constructor(
    public readonly id: number,
    public readonly transactionId: string,
    public readonly sumFull: number,
    public readonly sumReal: number,
    public readonly sumBonus: number,
    public readonly sumDiscount: number,
    public readonly sumCashback: number,
    public readonly carWashDeviceId: number,
    public readonly platform: string,
    public readonly cardId: number | null,
    public readonly contractType: string,
    public readonly orderData: Date,
    public readonly createData: Date,
    public readonly orderHandlerStatus: string | null,
    public readonly orderStatus: string,
    public readonly sendAnswerStatus: string | null,
    public readonly sendTime: Date | null,
    public readonly debitingMoney: Date | null,
    public readonly executionStatus: string | null,
    public readonly reasonError: string | null,
    public readonly executionError: string | null,
    public readonly handlerError: string | null,
    public readonly card?: LTYCard | null,
    public readonly carWashDevice?: CarWashDevice | null,
  ) {}

  static fromPrisma(order: LTYOrder & { card?: LTYCard | null; carWashDevice?: CarWashDevice | null }): Order {
    return new Order(
      order.id,
      order.transactionId,
      order.sumFull,
      order.sumReal,
      order.sumBonus,
      order.sumDiscount,
      order.sumCashback,
      order.carWashDeviceId,
      order.platform,
      order.cardId,
      order.contractType,
      order.orderData,
      order.createData,
      order.orderHandlerStatus,
      order.orderStatus,
      order.sendAnswerStatus,
      order.sendTime,
      order.debitingMoney,
      order.executionStatus,
      order.reasonError,
      order.executionError,
      order.handlerError,
      order.card,
      order.carWashDevice,
    );
  }

  getOrderData(): Date {
    return this.orderData;
  }

  getSumFull(): number {
    return this.sumFull;
  }

  getSumReal(): number {
    return this.sumReal;
  }

  getSumBonus(): number {
    return this.sumBonus;
  }

  getOrderStatus(): string {
    return this.orderStatus;
  }

  getPlatform(): string {
    return this.platform;
  }
}
