import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';

@Injectable()
export class DeleteLoyaltyTierUseCase {
  constructor(private readonly loyaltyTierRepository: ILoyaltyTierRepository) {}

  async execute(loyaltyTierId: number): Promise<void> {
    await this.loyaltyTierRepository.delete(loyaltyTierId);
  }
}
