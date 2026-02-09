import { Injectable, HttpStatus } from '@nestjs/common';
import { IPromoCodeRepository } from '../interface/promo-code-repository.interface';
import { LoyaltyException } from '@exception/option.exceptions';

@Injectable()
export class DeletePromocodeUseCase {
  constructor(private readonly promoCodeRepository: IPromoCodeRepository) {}

  async execute(id: number): Promise<void> {
    const existingPromocode = await this.promoCodeRepository.findById(id);

    if (!existingPromocode) {
      throw new LoyaltyException(
        HttpStatus.NOT_FOUND,
        'Promocode not found',
      );
    }

    if (existingPromocode.campaignId) {
      throw new LoyaltyException(
        HttpStatus.FORBIDDEN,
        'Campaign promocodes cannot be deleted',
      );
    }

    await this.promoCodeRepository.delete(id);
  }
}
