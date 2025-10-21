import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { LoyaltyProgramAnalyticsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-analytics-response.dto';

@Injectable()
export class GetLoyaltyProgramAnalyticsUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
  ) {}

  async execute(loyaltyProgramId: number): Promise<LoyaltyProgramAnalyticsResponseDto> {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneById(loyaltyProgramId);
    
    if (!loyaltyProgram) {
      throw new Error(`Loyalty program with ID ${loyaltyProgramId} not found`);
    }

    const organizations = await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
      loyaltyProgramId,
    );

    let numberOfPoses = 0;
    let numberOfClients = 0;

    if (organizations.length > 0) {
      const organizationIds = organizations.map(org => org.id);

      const poses = await this.findMethodsPosUseCase.getAllByOrganizationIds(organizationIds);
      numberOfPoses = poses.length;

      for (const organizationId of organizationIds) {
        const clientCount = await this.findMethodsClientUseCase.getCountByFilter(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined, 
          undefined,
          organizationId,
        );
        numberOfClients += clientCount;
      }
    }

    const daysExisted = this.calculateDaysExisted(loyaltyProgram.startDate);

    return {
      numberOfPoses,
      numberOfClients,
      daysExisted,
    };
  }

  private calculateDaysExisted(startDate: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
