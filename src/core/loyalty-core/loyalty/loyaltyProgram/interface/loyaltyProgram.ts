import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export abstract class ILoyaltyProgramRepository {
  abstract create(
    input: LTYProgram,
    ownerOrganizationId: number,
  ): Promise<LTYProgram>;
  abstract findOneById(id: number): Promise<LTYProgram>;
  abstract findOneByOrganizationId(
    organizationId: number,
  ): Promise<LTYProgram>;
  abstract findOneByOwnerOrganizationId(
    ownerOrganizationId: number,
  ): Promise<LTYProgram>;
  abstract findOneByCardTierId(cardTierId: number): Promise<LTYProgram>;
  abstract findAll(): Promise<LTYProgram[]>;
  abstract findAllByPermission(
    ability: any,
    organizationId?: number,
  ): Promise<LTYProgram[]>;
  abstract findAllByUserId(userId: number): Promise<LTYProgram[]>;
  abstract findAllParticipantProgramsByOrganizationId(organizationId: number): Promise<LTYProgram[]>;
  abstract update(
    input: LTYProgram,
  ): Promise<LTYProgram>;
  abstract updateIsHubStatus(
    id: number,
    isHub: boolean,
  ): Promise<LTYProgram>;
}
