import { Injectable } from '@nestjs/common';
import { Pos } from '@pos/pos/domain/pos';
import { LoyaltyCardBalanceResponseDto } from '@platform-device/device/controller/dto/response/loyalty-cardBalance-response.dto';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { LTYBenefitType, StatusUser } from '@prisma/client';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';

@Injectable()
export class OrderGetBalanceForDeviceUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
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

    const { maxDiscount, maxCashback } = this.calculateMaxBenefits(
      cardData.benefits,
    );

    return {
      errcode: 200,
      balance: cardData.balance,
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

  private createErrorResponse(errcode: number): LoyaltyCardBalanceResponseDto {
    return {
      errcode,
      balance: 0,
      discount: 0,
      cashback: 0,
    };
  }
}
