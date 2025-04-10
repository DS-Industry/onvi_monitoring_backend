import { Provider } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/repository/loyaltyProgram';

export const LoyaltyProgramRepositoryProvider: Provider = {
  provide: ILoyaltyProgramRepository,
  useClass: LoyaltyProgramRepository,
};
