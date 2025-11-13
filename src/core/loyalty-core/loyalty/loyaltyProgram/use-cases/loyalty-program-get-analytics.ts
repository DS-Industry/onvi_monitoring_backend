import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';

export interface LoyaltyProgramAnalyticsDto {
  connectedPoses: number;
  engagedClients: number;
  programDurationDays: number;
}

@Injectable()
export class GetLoyaltyProgramAnalyticsUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly cardRepository: ICardRepository,
  ) {}

  async execute(loyaltyProgramId: number): Promise<LoyaltyProgramAnalyticsDto> {
    const loyaltyProgram =
      await this.loyaltyProgramRepository.findOneById(loyaltyProgramId);

    if (!loyaltyProgram) {
      throw new Error(`Loyalty program with ID ${loyaltyProgramId} not found`);
    }

    const organizations =
      await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
        loyaltyProgramId,
      );

    let connectedPoses = 0;
    if (organizations.length > 0) {
      const organizationIds = organizations.map((org) => org.id);
      const poses =
        await this.findMethodsPosUseCase.getAllByOrganizationIds(
          organizationIds,
        );
      connectedPoses = poses.length;
    }

    const engagedClients =
      await this.cardRepository.countByLoyaltyProgramId(loyaltyProgramId);

    const now = new Date();
    const programDurationDays = Math.floor(
      (now.getTime() - loyaltyProgram.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return {
      connectedPoses,
      engagedClients,
      programDurationDays,
    };
  }
}
