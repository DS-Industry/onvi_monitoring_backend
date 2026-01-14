import { Injectable, Inject, Logger } from '@nestjs/common';
import { Order } from '@loyalty/order/domain/order';
import { IPromoCodeRepository } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';

@Injectable()
export class ShouldAddMarketingRewardsUseCase {
  private readonly logger = new Logger(ShouldAddMarketingRewardsUseCase.name);

  constructor(
    @Inject(IPromoCodeRepository)
    private readonly promoCodeRepository: IPromoCodeRepository,
  ) {}

  async execute(order: Order): Promise<boolean> {
    const noDiscountApplied = order.sumDiscount === 0;
    
    this.logger.log(
      `Checking promocode usage for order#${order.id}`,
    );
    
    const promocodeUsage = await this.promoCodeRepository.findUsageByOrderId(
      order.id,
    );
    const noPromoCodeUsed = !promocodeUsage;

    this.logger.log(
      `Promocode check for order#${order.id}: noDiscountApplied=${noDiscountApplied}, noPromoCodeUsed=${noPromoCodeUsed}`,
    );

    return noDiscountApplied && noPromoCodeUsed;
  }
}
