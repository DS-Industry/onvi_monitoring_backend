import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LoyaltyProgramParticipantResponseDto, mapLoyaltyProgramToParticipantResponse } from '@platform-user/core-controller/dto/response/loyalty-program-participant-response.dto';

@Injectable()
export class FindMethodsLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async getAll(): Promise<LTYProgram[]> {
    return await this.loyaltyProgramRepository.findAll();
  }

  async getOneById(id: number): Promise<LTYProgram> {
    return await this.loyaltyProgramRepository.findOneById(id);
  }

  async getOneByOrganizationId(
    organizationId: number,
  ): Promise<LTYProgram> {
    return await this.loyaltyProgramRepository.findOneByOrganizationId(
      organizationId,
    );
  }

  async getOneByOwnerOrganizationId(
    ownerOrganizationId: number,
  ): Promise<LTYProgram> {
    return await this.loyaltyProgramRepository.findOneByOwnerOrganizationId(
      ownerOrganizationId,
    );
  }

  async getOneByLoyaltyCardTierId(
    loyaltyCardTierId: number,
  ): Promise<LTYProgram> {
    return await this.loyaltyProgramRepository.findOneByCardTierId(
      loyaltyCardTierId,
    );
  }

  async getAllByAbility(
    ability: any,
    organizationId?: number,
  ): Promise<LTYProgram[]> {
    return await this.loyaltyProgramRepository.findAllByPermission(
      ability,
      organizationId,
    );
  }

  async getAllByUserId(userId: number): Promise<LTYProgram[]> {
    return await this.loyaltyProgramRepository.findAllByUserId(userId);
  }

  async getAllParticipantProgramsByOrganizationId(organizationId: number): Promise<LoyaltyProgramParticipantResponseDto[]> {
    const results = await this.loyaltyProgramRepository.findAllParticipantProgramsByOrganizationId(organizationId);
    return results.map(({ program, participantId }) => 
      mapLoyaltyProgramToParticipantResponse(program, participantId)
    );
  }

  async getAllPublicPrograms(filters?: {
    search?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<LTYProgram[]> {
    return await this.loyaltyProgramRepository.findAllPublicPrograms(filters);
  }
}
