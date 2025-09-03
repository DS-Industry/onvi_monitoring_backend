import { Injectable } from '@nestjs/common';
import { Pos } from '@pos/pos/domain/pos';
import { LoyaltyCardBalanceResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardBalance-response.dto';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { LTYBenefitType, OrderStatus, StatusUser } from '@prisma/client';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { FindMethodsOrderUseCase } from '@loyalty/order/use-cases/order-find-methods';

@Injectable()
export class OrderGetBalanceForDeviceUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly findMethodsOrderUseCase: FindMethodsOrderUseCase,
  ) {}

  async execute(
    pos: Pos,
    devNumber: string,
  ): Promise<LoyaltyCardBalanceResponseDto> {
    const cardData =
      await this.findMethodsCardUseCase.getFullCardInfoForDevice(devNumber);
    if (!cardData) {
      return this.createErrorResponse(1);
    }
    if (cardData.status != StatusUser.ACTIVE) {
      return this.createErrorResponse(2);
    }
    if (!this.checkOrganizationAccess(pos, cardData)) {
      return this.createErrorResponse(3);
    }

    const ownerCard =
      await this.findMethodsCardUseCase.getOwnerCorporationCard(devNumber);

    let finalBalance: number;
    let targetBenefits: { bonus: number; benefitType: LTYBenefitType }[];

    if (ownerCard) {
      const monthlySpent = await this.getMonthlySpentAmount(cardData.cardId);
      const monthlyLimit = cardData.monthlyLimit ?? 0;

      const availableBalance = Math.min(
        ownerCard.balance,
        monthlyLimit - monthlySpent,
      );
      finalBalance = Math.max(availableBalance, 0);
      targetBenefits = ownerCard.benefits;
    } else {
      finalBalance = cardData.balance;
      targetBenefits = cardData.benefits;
    }

    const { maxDiscount, maxCashback } =
      this.calculateMaxBenefits(targetBenefits);

    return {
      errcode: 200,
      balance: finalBalance,
      discount: maxDiscount,
      cashback: maxCashback,
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

  private calculateMaxBenefits(
    benefits: {
      bonus: number;
      benefitType: LTYBenefitType;
    }[],
  ): { maxDiscount: number; maxCashback: number } {
    let maxDiscount = 0;
    let maxCashback = 0;

    if (!benefits || benefits.length === 0) {
      return { maxDiscount, maxCashback };
    }

    benefits.forEach((benefit) => {
      if (
        benefit.benefitType === LTYBenefitType.DISCOUNT &&
        benefit.bonus > maxDiscount
      ) {
        maxDiscount = benefit.bonus;
      } else if (
        benefit.benefitType === LTYBenefitType.CASHBACK &&
        benefit.bonus > maxCashback
      ) {
        maxCashback = benefit.bonus;
      }
    });

    return { maxDiscount, maxCashback };
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

  private createErrorResponse(errcode: number): LoyaltyCardBalanceResponseDto {
    return {
      errcode,
      balance: 0,
      discount: 0,
      cashback: 0,
    };
  }
}
