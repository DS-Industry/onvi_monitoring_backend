import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UpdateHandlerLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-update-handler';

@Injectable()
export class HandlerUpdateTierCron {
  constructor(
    private readonly updateHandlerLoyaltyTierUseCase: UpdateHandlerLoyaltyTierUseCase,
  ) {}

  @Cron('0 0 28 * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    await this.updateHandlerLoyaltyTierUseCase.execute();
  }
}
