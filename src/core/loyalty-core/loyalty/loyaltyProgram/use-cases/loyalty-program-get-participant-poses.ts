import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';

@Injectable()
export class GetParticipantPosesUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  async execute(loyaltyProgramId: number): Promise<PosResponseDto[]> {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneById(loyaltyProgramId);
    
    if (!loyaltyProgram) {
      throw new Error(`Loyalty program with ID ${loyaltyProgramId} not found`);
    }
    const organizations = await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
      loyaltyProgramId,
    );

    if (organizations.length === 0) {
      return [];
    }

    const organizationIds = organizations.map(org => org.id);

    const poses = await this.findMethodsPosUseCase.getAllByOrganizationIds(organizationIds);

    return poses;
  }
}
