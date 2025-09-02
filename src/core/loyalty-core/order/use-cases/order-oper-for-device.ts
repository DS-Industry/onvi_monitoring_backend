import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { LoyaltyCardOperResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardOper-response.dto';
import {
  LTYBenefitType,
  OrderStatus,
  PlatformType,
  StatusUser,
} from '@prisma/client';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';

@Injectable()
export class OrderOperForDeviceUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly handlerOrderUseCase: HandlerOrderUseCase,
  ) {}

  async execute(
    pos: Pos,
    deviceId: number,
    devNumber: string,
    sum: number,
  ): Promise<LoyaltyCardOperResponseDto> {
    const cardData =
      await this.findMethodsCardUseCase.getFullCardInfoForDevice(devNumber);
    if (!cardData) {
      return this.createErrorResponse(1, 'Карта не найдена');
    }
    if (cardData.status != StatusUser.ACTIVE) {
      return this.createErrorResponse(5, 'Карта не активирована');
    }
    if (!this.checkOrganizationAccess(pos, cardData)) {
      return this.createErrorResponse(3, 'Нет доступа по карте');
    }
    if (cardData.balance < sum) {
      return this.createErrorResponse(4, 'Недостаточно средств');
    }

    const discountSum = 0;
    /*const discount = this.calculateMaxDiscount(cardData.benefits);
    if (discount.maxDiscount > 0) {
      discountSum = Math.round(sum * (discount.maxDiscount / 100));
    }*/

    const ownerCard =
      await this.findMethodsCardUseCase.getOwnerCorporationCard(devNumber);

    const orderData = {
      transactionId: this.generateTransactionId(),
      sumFull: sum,
      sumReal: 0,
      sumBonus: sum - discountSum,
      sumDiscount: discountSum,
      sumCashback: 0,
      carWashDeviceId: deviceId,
      platform: PlatformType.LOCAL_LOYALTY,
      orderData: new Date(),
      orderStatus: OrderStatus.COMPLETED,
      cardMobileUserId: cardData.cardId,
    };

    const order = ownerCard
      ? await this.handlerOrderUseCase.execute(orderData, ownerCard)
      : await this.handlerOrderUseCase.execute(orderData);

    return {
      errcode: 200,
      errmes: '',
      balance: cardData.balance - (sum - discountSum),
      oper_id: order.id,
    };
  }

  private checkOrganizationAccess(
    pos: Pos,
    cardData: LoyaltyCardInfoFullResponseDto,
  ): boolean {
    if (!cardData.loyaltyProgram?.organizations?.length) {
      return false;
    }

    return cardData.loyaltyProgram.organizations.some(
      (org) => org.id === pos.organizationId,
    );
  }

  private calculateMaxDiscount(
    benefits: {
      bonus: number;
      benefitType: LTYBenefitType;
    }[],
  ): { maxDiscount: number } {
    let maxDiscount = 0;

    if (!benefits || benefits.length === 0) {
      return { maxDiscount };
    }

    benefits.forEach((benefit) => {
      if (
        benefit.benefitType === LTYBenefitType.DISCOUNT &&
        benefit.bonus > maxDiscount
      ) {
        maxDiscount = benefit.bonus;
      }
    });

    return { maxDiscount };
  }

  private createErrorResponse(
    errcode: number,
    errmes: string,
  ): LoyaltyCardOperResponseDto {
    return {
      errcode,
      errmes,
      balance: 0,
      oper_id: 0,
    };
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }
}
