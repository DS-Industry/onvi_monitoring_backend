import { User } from '@platform-user/user/domain/user';

export abstract class IUserRepository {
  abstract create(input: User): Promise<User>;
  abstract createWorker(input: User, organizationId: number): Promise<User>;
  abstract createMany(input: User[]): Promise<User[]>;
  abstract findOneById(id: number): Promise<User>;
  abstract findOneByEmail(email: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract findAllByOrgId(
    orgId: number,
    skip?: number,
    take?: number,
  ): Promise<User[]>;
  abstract findAllByOrgIdWithFilters(
    orgId: number,
    roleId?: number,
    status?: string,
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<User[]>;
  abstract findCountByOrgId(orgId: number): Promise<number>;
  abstract findAllByPosId(posId: number): Promise<User[]>;
  abstract findAllByRoleIds(roleIds: number[]): Promise<User[]>;
  abstract findAllByRoleIdsAndPosId(
    roleIds: number[],
    posId: number,
  ): Promise<User[]>;
  abstract update(id: number, input: User): Promise<User>;
  abstract remove(id: number): Promise<any>;
  abstract getAllPosPermissions(id: number): Promise<number[]>;
  abstract getAllLoyaltyProgramPermissions(id: number): Promise<number[]>;
  abstract getAllOrganizationPermissions(
    id: number,
  ): Promise<{ id: number; name: string }[]>;
  abstract updateConnectionPos(
    userId: number,
    addPosIds: number[],
    deletePosIds: number[],
  ): Promise<any>;
  abstract updateConnectionLoyaltyProgram(
    userId: number,
    addLoyaltyProgramIds: number[],
    deleteLoyaltyProgramIds: number[],
  ): Promise<any>;
}
