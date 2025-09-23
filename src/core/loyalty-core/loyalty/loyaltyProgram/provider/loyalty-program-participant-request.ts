import { Provider } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/repository/loyalty-program-participant-request';

export const LoyaltyProgramParticipantRequestRepositoryProvider: Provider = {
  provide: ILoyaltyProgramParticipantRequestRepository,
  useClass: LoyaltyProgramParticipantRequestRepository,
};
