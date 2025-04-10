import { Injectable } from '@nestjs/common';
import { IBenefitRepository } from '@loyalty/loyalty/benefit/benefit/interface/benefit';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';

@Injectable()
export class FindMethodsBenefitUseCase {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  async getOneById(id: number): Promise<Benefit> {
    return await this.benefitRepository.findOneById(id);
  }

  async getAllByLoyaltyTierId(loyaltyTierId: number): Promise<Benefit[]> {
    return await this.benefitRepository.findAllByLoyaltyTierId(loyaltyTierId);
  }

  async getAll(): Promise<Benefit[]> {
    return await this.benefitRepository.findAll();
  }
}
