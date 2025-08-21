import { Injectable } from '@nestjs/common';
import { OrganizationFilterResponseDto } from '@platform-user/core-controller/dto/response/organization-filter-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FilterByUserOrganizationUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
  ) {}

  async execute(
    user: User,
    placementId: number | '*',
    noLoyaltyProgram?: boolean,
  ): Promise<OrganizationFilterResponseDto[]> {
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByUser(
        user,
        placementId,
        noLoyaltyProgram ?? false,
      );

    return organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      address: organization.address,
      organizationDocumentId: organization?.organizationDocumentId,
      organizationStatus: organization.organizationStatus,
      organizationType: organization.organizationType,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      ownerId: organization.ownerId,
    }));
  }
}
