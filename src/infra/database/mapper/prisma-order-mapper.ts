import { LTYOrder as PrismaOrder, Prisma, CarWashDevice, CarWashDeviceType } from '@prisma/client';
import { Order } from '@loyalty/order/domain/order';

export class PrismaOrderMapper {
  static toDomain(entity: PrismaOrder & { carWashDevice?: CarWashDevice & { carWashDeviceType?: CarWashDeviceType } }): Order {
    if (!entity) {
      return null;
    }
    return new Order({
      id: entity.id,
      transactionId: entity.transactionId,
      sumFull: entity.sumFull,
      sumReal: entity.sumReal,
      sumBonus: entity.sumBonus,
      sumDiscount: entity.sumDiscount,
      sumCashback: entity.sumCashback,
      carWashDeviceId: entity.carWashDeviceId,
      carWashId: entity.carWashDevice.id,
      platform: entity.platform,
      bayType: entity.carWashDevice.carWashDeviceType.name,
      cardMobileUserId: entity.cardId,
      typeMobileUser: entity.contractType,
      orderData: entity.orderData,
      createData: entity.createData,
      orderStatus: entity.orderStatus,
      sendAnswerStatus: entity.sendAnswerStatus,
      sendTime: entity.sendTime,
      debitingMoney: entity.debitingMoney,
      executionStatus: entity.executionStatus,
      reasonError: entity.reasonError,
      executionError: entity.executionError,
      handlerError: entity.handlerError,
      orderHandlerStatus: entity.orderHandlerStatus,
    });
  }

  static toPrisma(order: Order): Prisma.LTYOrderUncheckedCreateInput {
    return {
      id: order?.id,
      transactionId: order.transactionId,
      sumFull: order.sumFull,
      sumReal: order.sumReal,
      sumBonus: order.sumBonus,
      sumDiscount: order.sumDiscount,
      sumCashback: order.sumCashback,
      carWashDeviceId: order.carWashDeviceId,
      platform: order.platform,
      cardId: order?.cardMobileUserId,
      contractType: order.typeMobileUser,
      orderData: order.orderData,
      createData: order.createData,
      orderStatus: order.orderStatus,
      sendAnswerStatus: order?.sendAnswerStatus,
      sendTime: order?.sendTime,
      debitingMoney: order?.debitingMoney,
      executionStatus: order?.executionStatus,
      reasonError: order?.reasonError,
      executionError: order?.executionError,
      handlerError: order?.handlerError,
      orderHandlerStatus: order?.orderHandlerStatus,
    };
  }
}
