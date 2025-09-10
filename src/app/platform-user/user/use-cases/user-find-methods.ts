import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FindMethodsUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getByEmail(input: string) {
    return await this.userRepository.findOneByEmail(input);
  }

  async getById(input: number) {
    return await this.userRepository.findOneById(input);
  }

  async getOrgPermissionById(
    input: number,
  ): Promise<{ id: number; name: string }[]> {
    return await this.userRepository.getAllOrganizationPermissions(input);
  }

  async getPosPermissionById(input: number): Promise<number[]> {
    return await this.userRepository.getAllPosPermissions(input);
  }

  async getLoyaltyProgramPermissionById(input: number): Promise<number[]> {
    return await this.userRepository.getAllLoyaltyProgramPermissions(input);
  }

  async getAllByOrgId(
    orgId: number,
    skip?: number,
    take?: number,
  ): Promise<User[]> {
    return await this.userRepository.findAllByOrgId(orgId, skip, take);
  }

  async getAllByOrgIdWithFilters(
    orgId: number,
    roleId?: number,
    status?: string,
    name?: string,
    skip?: number,
    take?: number,
  ): Promise<User[]> {
    return await this.userRepository.findAllByOrgIdWithFilters(
      orgId,
      roleId,
      status,
      name,
      skip,
      take,
    );
  }

  async getCountByOrgId(orgId: number): Promise<{ count: number }> {
    const count = await this.userRepository.findCountByOrgId(orgId);
    return { count };
  }

  async getAllByPosId(posId: number): Promise<User[]> {
    return await this.userRepository.findAllByPosId(posId);
  }

  async getAllByRoleIds(roleIds: number[]): Promise<User[]> {
    return await this.userRepository.findAllByRoleIds(roleIds);
  }

  async getAllByRoleIdsAndPosId(
    roleIds: number[],
    posId: number,
  ): Promise<User[]> {
    return await this.userRepository.findAllByRoleIdsAndPosId(roleIds, posId);
  }
}
