import { Provider } from '@nestjs/common';
import { ILoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-hub-request';
import { LoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/repository/loyalty-program-hub-request';

export const LoyaltyProgramHubRequestRepositoryProvider: Provider = {
  provide: ILoyaltyProgramHubRequestRepository,
  useClass: LoyaltyProgramHubRequestRepository,
};
