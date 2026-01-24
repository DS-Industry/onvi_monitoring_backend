import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderUseCase } from '@loyalty/order/use-cases/order-create';
import { Order } from '@loyalty/order/domain/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { HandlerDto } from '@loyalty/order/use-cases/dto/handler.dto';
import { OrderHandlerStatus, PlatformType, OrderStatus } from '@loyalty/order/domain/enums';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { FindMethodsCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-find-methods';
import {
  CASHBACK_BONUSES_OPER_TYPE_ID,
  MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
  USING_BONUSES_OPER_TYPE_ID,
} from '@constant/constants';
import { UpdateOrderUseCase } from '@loyalty/order/use-cases/order-update';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { IPromoCodeRepository } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';

@Injectable()
export class HandlerOrderUseCase {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
    private readonly findMethodsCardBonusOperUseCase: FindMethodsCardBonusOperUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly orderRepository: IOrderRepository,
    @Inject(IPromoCodeRepository)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(
    data: HandlerDto,
    ownerCard?: LoyaltyCardInfoFullResponseDto,
    existingOrderId?: number,
  ): Promise<Order> {
    if (data.platform != PlatformType.ONVI && data.clientPhone) {
      const card = await this.findMethodsCardUseCase.getByClientPhone(
        data.clientPhone,
      );
      if (card) {
        data.cardMobileUserId = card.id;
      }
    }
    let order: Order;
    if (existingOrderId) {
      const found = await this.orderRepository.findOneById(existingOrderId);
      order = found ? found : await this.createOrderUseCase.execute(data);
    } else {
      order = await this.createOrderUseCase.execute(data);
    }

    let orderHandlerStatus: OrderHandlerStatus = OrderHandlerStatus.COMPLETED;
    let handlerError = '';

    try {
      if (data.platform == PlatformType.ONVI) {
        const card = await this.findMethodsCardUseCase.getById(
          data.cardMobileUserId,
        );
        if (data.sumBonus > 0) {
          const existingDeduction =
            await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
              order.id,
              USING_BONUSES_OPER_TYPE_ID,
            );
          if (!existingDeduction) {
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
        }
        if (data.sumCashback > 0) {
          const existingCashback =
            await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
              order.id,
              CASHBACK_BONUSES_OPER_TYPE_ID,
            );
          if (!existingCashback) {
            await this.createCardBonusOperUseCase.execute(
              {
                carWashDeviceId: data.carWashDeviceId,
                typeOperId: CASHBACK_BONUSES_OPER_TYPE_ID,
                operDate: data.orderData,
                sum: data.sumCashback,
                orderMobileUserId: order.id,
              },
              card,
            );
          }
        }

        if (data.sumDiscount > 0) {
          const marketingUsage =
            await this.promoCodeRepository.findDiscountUsageByOrderId(order.id);
          if (marketingUsage) {
            const existingMarketingBonus =
              await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
                order.id,
                MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
              );
            if (!existingMarketingBonus) {
              await this.createCardBonusOperUseCase.execute(
                {
                  carWashDeviceId: data.carWashDeviceId,
                  typeOperId: MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
                  operDate: data.orderData,
                  sum: data.sumDiscount,
                  orderMobileUserId: order.id,
                },
                card,
              );
            }
          }
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

    let finalOrderStatus = order.orderStatus;
    if (
      orderHandlerStatus === OrderHandlerStatus.COMPLETED &&
      order.orderStatus !== OrderStatus.COMPLETED 
    ) {
      finalOrderStatus = OrderStatus.COMPLETED;
    }

    return await this.updateOrderUseCase.execute(
      {
        orderStatus: finalOrderStatus,
        orderHandlerStatus: orderHandlerStatus,
        handlerError: handlerError,
      },
      order,
    );
  }
}
