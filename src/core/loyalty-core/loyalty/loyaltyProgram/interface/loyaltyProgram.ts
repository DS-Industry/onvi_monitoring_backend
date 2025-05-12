import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export abstract class ILoyaltyProgramRepository {
  abstract create(
    input: LoyaltyProgram,
    organizationIds: number[],
    userId: number,
  ): Promise<LoyaltyProgram>;
  abstract findOneById(id: number): Promise<LoyaltyProgram>;
  abstract findOneByOrganizationId(
    organizationId: number,
  ): Promise<LoyaltyProgram>;
  abstract findOneByLoyaltyCardTierId(
    loyaltyCardTierId: number,
  ): Promise<LoyaltyProgram>;
  abstract findAll(): Promise<LoyaltyProgram[]>;
  abstract findAllByPermission(ability: any): Promise<LoyaltyProgram[]>;
  abstract update(
    input: LoyaltyProgram,
    addOrganizationIds: number[],
    deleteOrganizationIds: number[],
  ): Promise<LoyaltyProgram>;
}
