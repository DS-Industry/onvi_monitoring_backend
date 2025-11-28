import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LoyaltyParticipantRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-participant-requests-filter.dto';
import { LoyaltyParticipantRequestsListResponseDto } from '@platform-user/core-controller/dto/response/loyalty-participant-requests-response.dto';

@Injectable()
export class FindLoyaltyParticipantRequestsUseCase {
  constructor(
    private readonly participantRequestRepository: ILoyaltyProgramParticipantRequestRepository,
  ) {}

  async execute(
    filter: LoyaltyParticipantRequestsFilterDto,
  ): Promise<LoyaltyParticipantRequestsListResponseDto> {
    return this.participantRequestRepository.findManyWithPagination(filter);
  }
}
