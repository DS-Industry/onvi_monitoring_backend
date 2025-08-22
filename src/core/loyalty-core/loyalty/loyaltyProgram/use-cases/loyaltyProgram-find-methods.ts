import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

@Injectable()
export class FindMethodsLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async getAll(): Promise<LoyaltyProgram[]> {
    return await this.loyaltyProgramRepository.findAll();
  }

  async getOneById(id: number): Promise<LoyaltyProgram> {
    return await this.loyaltyProgramRepository.findOneById(id);
  }

  async getOneByOrganizationId(
    organizationId: number,
  ): Promise<LoyaltyProgram> {
    return await this.loyaltyProgramRepository.findOneByOrganizationId(
      organizationId,
    );
  }

  async getOneByLoyaltyCardTierId(
    loyaltyCardTierId: number,
  ): Promise<LoyaltyProgram> {
    return await this.loyaltyProgramRepository.findOneByCardTierId(
      loyaltyCardTierId,
    );
  }

  async getAllByAbility(
    ability: any,
    organizationId?: number,
  ): Promise<LoyaltyProgram[]> {
    return await this.loyaltyProgramRepository.findAllByPermission(
      ability,
      organizationId,
    );
  }
}
