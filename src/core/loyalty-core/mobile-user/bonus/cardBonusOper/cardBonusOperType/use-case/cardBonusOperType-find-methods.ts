import { Injectable } from '@nestjs/common';
import { ICardBonusOperTypeRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/interface/cardBonusOperType';
import { CardBonusOperType } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/domain/cardBonusOperType';

@Injectable()
export class FindMethodsCardBonusOperTypeUseCase {
  constructor(
    private readonly cardBonusOperTypeRepository: ICardBonusOperTypeRepository,
  ) {}

  async getById(id: number): Promise<CardBonusOperType> {
    return await this.cardBonusOperTypeRepository.findOneById(id);
  }

  async getAll(): Promise<CardBonusOperType[]> {
    return await this.cardBonusOperTypeRepository.findAll();
  }
}
