import { Organization } from '../domain/organization';
import { User } from '@platform-user/user/domain/user';
import { Pos } from '@pos/pos/domain/pos';

export abstract class IOrganizationRepository {
  abstract create(input: Organization): Promise<Organization>;
  abstract findOneById(id: number): Promise<Organization>;
  abstract findOneByName(name: string): Promise<Organization>;
  abstract findOneBySlug(slug: string): Promise<Organization>;
  abstract findAll(): Promise<Organization[]>;
  abstract findAllByOwner(ownerId: number): Promise<Organization[]>;
  abstract findAllByUser(
    userId: number,
    placementId: number | '*',
    noLoyaltyProgram?: boolean,
  ): Promise<Organization[]>;
  abstract findAllByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<Organization[]>;
  abstract findAllUser(id: number): Promise<User[]>;
  abstract findAllPos(id: number): Promise<Pos[]>;
  abstract findAllByPermission(
    ability: any,
    placementId: number | '*',
  ): Promise<Organization[]>;
  abstract update(input: Organization): Promise<Organization>;
}
