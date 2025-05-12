import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';

@Injectable()
export class FindMethodsLoyaltyTierUseCase {
  constructor(private readonly loyaltyTierRepository: ILoyaltyTierRepository) {}

  async getOneById(id: number): Promise<LoyaltyTier> {
    return await this.loyaltyTierRepository.findOneById(id);
  }

  async getAllByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<LoyaltyTier[]> {
    return await this.loyaltyTierRepository.findAllByLoyaltyProgramId(
      loyaltyProgramId,
    );
  }

  async getAllByLoyaltyProgramIds(
    loyaltyProgramIds: number[],
  ): Promise<LoyaltyTier[]> {
    return await this.loyaltyTierRepository.findAllByLoyaltyProgramIds(
      loyaltyProgramIds,
    );
  }
}
