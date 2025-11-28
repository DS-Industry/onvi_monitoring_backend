import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramParticipantRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-participant-request';
import { LTYProgramRequestStatus } from '@prisma/client';

@Injectable()
export class CreateLoyaltyProgramParticipantRequestUseCase {
  constructor(
    private readonly participantRequestRepository: ILoyaltyProgramParticipantRequestRepository,
  ) {}

  async execute(
    ltyProgramId: number,
    organizationId: number,
    requestComment?: string,
  ): Promise<any> {
    const existingRequest = await this.participantRequestRepository.findFirst(
      ltyProgramId,
      organizationId,
      LTYProgramRequestStatus.PENDING,
    );

    if (existingRequest) {
      throw new Error(
        'A pending participation request already exists for this organization and loyalty program',
      );
    }

    const participantRequest = await this.participantRequestRepository.create(
      ltyProgramId,
      organizationId,
      LTYProgramRequestStatus.PENDING,
      requestComment,
    );

    return participantRequest;
  }
}
