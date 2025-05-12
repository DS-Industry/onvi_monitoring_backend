import { Injectable } from '@nestjs/common';
import { OrganizationFilterResponseDto } from '@platform-user/core-controller/dto/response/organization-filter-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';

@Injectable()
export class FilterByUserOrganizationUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
  ) {}

  async execute(
    ability: any,
    placementId: number | '*',
  ): Promise<OrganizationFilterResponseDto[]> {
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByAbility(
        ability,
        placementId,
      );
    const organizationFilters: OrganizationFilterResponseDto[] = [];

    await Promise.all(
      organizations.map(async (organization) => {
        organizationFilters.push({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          address: organization.address,
          organizationStatus: organization.organizationStatus,
          organizationType: organization.organizationType,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
          ownerId: organization.ownerId,
        });
      }),
    );

    return organizationFilters;
  }
}
