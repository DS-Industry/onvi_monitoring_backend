import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramHubRequestRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyalty-program-hub-request';
import { LoyaltyHubRequestsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-hub-requests-filter.dto';
import { LoyaltyHubRequestsListResponseDto } from '@platform-user/core-controller/dto/response/loyalty-hub-requests-response.dto';

@Injectable()
export class FindLoyaltyHubRequestsUseCase {
  constructor(private readonly hubRequestRepository: ILoyaltyProgramHubRequestRepository) {}

  async execute(filter: LoyaltyHubRequestsFilterDto): Promise<LoyaltyHubRequestsListResponseDto> {
    return this.hubRequestRepository.findManyWithPagination(filter);
  }
}
