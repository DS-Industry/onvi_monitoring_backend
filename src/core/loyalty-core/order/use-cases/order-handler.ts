import { Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from '@loyalty/order/use-cases/order-create';
import { Order } from '@loyalty/order/domain/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { HandlerDto } from '@loyalty/order/use-cases/dto/handler.dto';
import { OrderHandlerStatus, PlatformType } from '@prisma/client';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import {
  CASHBACK_BONUSES_OPER_TYPE_ID,
  USING_BONUSES_OPER_TYPE_ID,
} from '@constant/constants';
import { UpdateOrderUseCase } from '@loyalty/order/use-cases/order-update';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';

@Injectable()
export class HandlerOrderUseCase {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {}

  async execute(
    data: HandlerDto,
    ownerCard?: LoyaltyCardInfoFullResponseDto,
  ): Promise<Order> {
    if (data.platform != PlatformType.ONVI && data.clientPhone) {
      const card = await this.findMethodsCardUseCase.getByClientPhone(
        data.clientPhone,
      );
      if (card) {
        data.cardMobileUserId = card.id;
      }
    }
    const order = await this.createOrderUseCase.execute(data);

    let orderHandlerStatus: OrderHandlerStatus = OrderHandlerStatus.COMPLETED;
    let handlerError = '';

    try {
      if (data.platform == PlatformType.ONVI) {
        const card = await this.findMethodsCardUseCase.getById(
          data.cardMobileUserId,
        );
        if (data.sumBonus > 0) {
          await this.createCardBonusOperUseCase.execute(
            {
              carWashDeviceId: data.carWashDeviceId,
              typeOperId: USING_BONUSES_OPER_TYPE_ID,
              operDate: data.orderData,
              sum: data.sumBonus,
              orderMobileUserId: order.id,
            },
            card,
          );
        }
        if (data.sumCashback > 0) {
          await this.createCardBonusOperUseCase.execute(
            {
              typeOperId: CASHBACK_BONUSES_OPER_TYPE_ID,
              operDate: data.orderData,
              sum: data.sumCashback,
              orderMobileUserId: order.id,
            },
            card,
          );
        }
      } else if (data.platform == PlatformType.LOCAL_LOYALTY && ownerCard) {
        const card = await this.findMethodsCardUseCase.getById(
          ownerCard.cardId,
        );
        await this.createCardBonusOperUseCase.execute(
          {
            carWashDeviceId: data.carWashDeviceId,
            typeOperId: USING_BONUSES_OPER_TYPE_ID,
            operDate: data.orderData,
            sum: data.sumBonus,
            orderMobileUserId: order.id,
          },
          card,
        );
      }
    } catch (error) {
      orderHandlerStatus = OrderHandlerStatus.ERROR;
      handlerError = error.message;
    }

    return await this.updateOrderUseCase.execute(
      { orderHandlerStatus: orderHandlerStatus, handlerError: handlerError },
      order,
    );
  }
}
