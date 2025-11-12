import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import {
  LoyaltyProgramParticipantResponseDto,
  mapLoyaltyProgramToParticipantResponse,
} from '@platform-user/core-controller/dto/response/loyalty-program-participant-response.dto';
import { LoyaltyParticipantProgramsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/loyalty-participant-programs-paginated-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';

@Injectable()
export class FindMethodsLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly cardRepository: ICardRepository,
  ) {}

  async getAll(): Promise<LTYProgram[]> {
    return await this.loyaltyProgramRepository.findAll();
  }

  async getOneById(id: number): Promise<LTYProgram> {
    return await this.loyaltyProgramRepository.findOneById(id);
  }

  async getOneByOrganizationId(organizationId: number): Promise<LTYProgram> {
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

  async getAllParticipantProgramsByOrganizationId(
    organizationId: number,
  ): Promise<LoyaltyProgramParticipantResponseDto[]> {
    const results =
      await this.loyaltyProgramRepository.findAllParticipantProgramsByOrganizationId(
        organizationId,
      );
    return results.map(({ program, participantId }) =>
      mapLoyaltyProgramToParticipantResponse(program, participantId),
    );
  }

  async getAllParticipantProgramsByOrganizationIdPaginated(
    organizationId: number,
    page?: number,
    size?: number,
    status?: string,
    participationRole?: string,
    search?: string,
  ): Promise<LoyaltyParticipantProgramsPaginatedResponseDto> {
    const pageNum = page || 1;
    const sizeNum = size || 10;
    const skip = sizeNum * (pageNum - 1);
    const take = sizeNum;

    const [results, total] = await Promise.all([
      this.loyaltyProgramRepository.findAllParticipantProgramsByOrganizationIdPaginated(
        organizationId,
        skip,
        take,
        status,
        participationRole,
        search,
      ),
      this.loyaltyProgramRepository.countParticipantProgramsByOrganizationId(
        organizationId,
        status,
        participationRole,
        search,
      ),
    ]);

    const programsWithAnalytics = await Promise.all(
      results.map(async ({ program, participantId }) => {
        const organizations =
          await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
            program.id,
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
          await this.cardRepository.countByLoyaltyProgramId(program.id);

        return mapLoyaltyProgramToParticipantResponse(
          program,
          participantId,
          connectedPoses,
          engagedClients,
        );
      }),
    );

    const totalPages = Math.ceil(total / sizeNum);
    const hasNext = pageNum < totalPages;
    const hasPrevious = pageNum > 1;

    return {
      data: programsWithAnalytics,
      total,
      page: pageNum,
      size: sizeNum,
      totalPages,
      hasNext,
      hasPrevious,
    };
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
