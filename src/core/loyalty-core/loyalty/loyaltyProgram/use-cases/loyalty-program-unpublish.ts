import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LTYProgramStatus } from '@loyalty/loyalty/loyaltyProgram/domain/enums';

@Injectable()
export class UnpublishLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(loyaltyProgramId: number): Promise<LTYProgram> {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneById(loyaltyProgramId);
    
    if (!loyaltyProgram) {
      throw new Error('Loyalty program not found');
    }

    loyaltyProgram.status = LTYProgramStatus.PAUSE;
    
    return await this.loyaltyProgramRepository.update(loyaltyProgram);
  }
}
