import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { Organization } from '@organization/organization/domain/organization';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FindMethodsOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async getById(input: number): Promise<any> {
    return await this.organizationRepository.findOneById(input);
  }

  async getByName(input: string): Promise<any> {
    return await this.organizationRepository.findOneByName(input);
  }

  async getBySlug(input: string): Promise<any> {
    return await this.organizationRepository.findOneBySlug(input);
  }

  async getAllByOwner(input: number): Promise<Organization[]> {
    return await this.organizationRepository.findAllByOwner(input);
  }

  async getAllByUser(
    input: User,
    placementId?: number | '*',
  ): Promise<Organization[]> {
    return await this.organizationRepository.findAllByUser(
      input.id,
      placementId,
    );
  }

  async getAllByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<Organization[]> {
    return await this.organizationRepository.findAllByLoyaltyProgramId(
      loyaltyProgramId,
    );
  }

  async getAllWorker(input: number): Promise<User[]> {
    return await this.organizationRepository.findAllUser(input);
  }

  async getAllByAbility(
    input: any,
    placementId?: number | '*',
  ): Promise<Organization[]> {
    return this.organizationRepository.findAllByPermission(input, placementId);
  }
}
