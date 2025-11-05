import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { LoyaltyCardOperResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardOper-response.dto';
import {
  LTYBenefitType,
  StatusUser,
} from '@prisma/client';
import { OrderStatus, PlatformType } from '@loyalty/order/domain/enums';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { FindMethodsOrderUseCase } from "@loyalty/order/use-cases/order-find-methods";

@Injectable()
export class OrderOperForDeviceUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly handlerOrderUseCase: HandlerOrderUseCase,
    private readonly findMethodsOrderUseCase: FindMethodsOrderUseCase,
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
    const ownerCard =
      await this.findMethodsCardUseCase.getOwnerCorporationCard(devNumber);

    let finalBalance: number;
    if (ownerCard) {
      const monthlySpent = await this.getMonthlySpentAmount(cardData.cardId);
      const monthlyLimit = cardData.monthlyLimit ?? 0;

      const availableBalance = Math.min(
        ownerCard.balance,
        monthlyLimit - monthlySpent,
      );
      finalBalance = Math.max(availableBalance, 0);
    } else {
      finalBalance = cardData.balance;
    }

    if (finalBalance < sum) {
      return this.createErrorResponse(4, 'Недостаточно средств');
    }

    const discountSum = 0;
    /*const discount = this.calculateMaxDiscount(cardData.benefits);
    if (discount.maxDiscount > 0) {
      discountSum = Math.round(sum * (discount.maxDiscount / 100));
    }*/

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
      balance: finalBalance - (sum - discountSum),
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

  private async getMonthlySpentAmount(cardId: number): Promise<number> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const orders = await this.findMethodsOrderUseCase.getAllByFilter({
      dateStart: firstDayOfMonth,
      dateEnd: lastDayOfMonth,
      cardId: cardId,
      orderStatus: OrderStatus.COMPLETED,
    });

    return orders.reduce((total, order) => total + order.sumFull, 0);
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
