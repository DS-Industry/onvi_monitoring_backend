import {
  LTYOrder as PrismaOrder,
  Prisma,
  CarWashDevice,
  CarWashDeviceType,
} from '@prisma/client';
import { Order } from '@loyalty/order/domain/order';
import { EnumMapper } from './enum-mapper';

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
      platform: EnumMapper.toDomainPlatformType(entity.platform),
      bayType: entity.carWashDevice.carWashDeviceType.name,
      cardMobileUserId: entity.cardId,
      typeMobileUser: EnumMapper.toDomainContractType(entity.contractType),
      orderData: entity.orderData,
      createData: entity.createData,
      orderStatus: EnumMapper.toDomainOrderStatus(entity.orderStatus),
      sendAnswerStatus: entity.sendAnswerStatus
        ? EnumMapper.toDomainSendAnswerStatus(entity.sendAnswerStatus)
        : undefined,
      sendTime: entity.sendTime,
      debitingMoney: entity.debitingMoney,
      executionStatus: entity.executionStatus
        ? EnumMapper.toDomainExecutionStatus(entity.executionStatus)
        : undefined,
      reasonError: entity.reasonError,
      executionError: entity.executionError,
      handlerError: entity.handlerError,
      orderHandlerStatus: entity.orderHandlerStatus
        ? EnumMapper.toDomainOrderHandlerStatus(entity.orderHandlerStatus)
        : undefined,
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
      platform: EnumMapper.toPrismaPlatformType(order.platform),
      cardId: order?.cardMobileUserId,
      contractType: EnumMapper.toPrismaContractType(order.typeMobileUser),
      orderData: order.orderData,
      createData: order.createData,
      orderStatus: EnumMapper.toPrismaOrderStatus(order.orderStatus),
      sendAnswerStatus: order?.sendAnswerStatus
        ? EnumMapper.toPrismaSendAnswerStatus(order.sendAnswerStatus)
        : undefined,
      sendTime: order?.sendTime,
      debitingMoney: order?.debitingMoney,
      executionStatus: order?.executionStatus
        ? EnumMapper.toPrismaExecutionStatus(order.executionStatus)
        : undefined,
      reasonError: order?.reasonError,
      executionError: order?.executionError,
      handlerError: order?.handlerError,
      orderHandlerStatus: order?.orderHandlerStatus
        ? EnumMapper.toPrismaOrderHandlerStatus(order.orderHandlerStatus)
        : undefined,
    };
  }
}
