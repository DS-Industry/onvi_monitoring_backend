import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';

@Injectable()
export class FindParticipantRequestByIdUseCase {
  constructor(
    private readonly participantRequestRepository: ILoyaltyProgramParticipantRequestRepository,
  ) {}

  async execute(id: number): Promise<any> {
    return this.participantRequestRepository.findById(id);
  }
}
