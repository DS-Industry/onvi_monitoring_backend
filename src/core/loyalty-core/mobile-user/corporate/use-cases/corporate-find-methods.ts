import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';

@Injectable()
export class FindMethodsCorporateUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async getById(id: number): Promise<Corporate | null> {
    return await this.corporateRepository.findOneById(id);
  }
}
