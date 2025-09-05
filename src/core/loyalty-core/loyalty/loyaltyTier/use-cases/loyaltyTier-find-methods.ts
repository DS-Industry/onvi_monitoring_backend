import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { LoyaltyTierUpdateInfoResponseDto } from '@loyalty/loyalty/loyaltyTier/use-cases/dto/loyaltyTier-update-info-response.dto';

@Injectable()
export class FindMethodsLoyaltyTierUseCase {
  constructor(private readonly loyaltyTierRepository: ILoyaltyTierRepository) {}

  async getOneById(id: number): Promise<LoyaltyTier> {
    return await this.loyaltyTierRepository.findOneById(id);
  }

  async getAllByLoyaltyProgramId(
    loyaltyProgramId: number,
    onlyWithoutChildren?: boolean,
  ): Promise<LoyaltyTier[]> {
    return await this.loyaltyTierRepository.findAllByLoyaltyProgramId(
      loyaltyProgramId,
      onlyWithoutChildren,
    );
  }

  async getAllByLoyaltyProgramIds(
    loyaltyProgramIds: number[],
  ): Promise<LoyaltyTier[]> {
    return await this.loyaltyTierRepository.findAllByLoyaltyProgramIds(
      loyaltyProgramIds,
    );
  }

  async getCardsForTierUpdate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<LoyaltyTierUpdateInfoResponseDto[]> {
    return await this.loyaltyTierRepository.findCardsForTierUpdate(
      dateStart,
      dateEnd,
    );
  }
}
