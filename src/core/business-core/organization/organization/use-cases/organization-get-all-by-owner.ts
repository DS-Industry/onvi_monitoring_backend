import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { Organization } from '@organization/organization/domain/organization';

@Injectable()
export class GetAllOrganizationByOwnerUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(ownerId: number): Promise<Organization[]> {
    const organizations =
      await this.organizationRepository.findAllByOwner(ownerId);
    if (organizations.length == 0) {
      throw new Error('organization not exists');
    }
    return organizations;
  }
}
