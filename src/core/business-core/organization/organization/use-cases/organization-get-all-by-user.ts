import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { Organization } from '@organization/organization/domain/organization';

@Injectable()
export class GetAllByUserOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(userId: number): Promise<Organization[]> {
    const organizations =
      await this.organizationRepository.findAllByUser(userId);
    if (organizations.length == 0) {
      return [];
    }
    return organizations;
  }
}
