import { Injectable } from '@nestjs/common';
import { GetAllByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-by-user';
import { OrganizationFilterResponseDto } from '@platform-user/organization/controller/dto/organization-filter-response.dto';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';

@Injectable()
export class FilterByUserOrganizationUseCase {
  constructor(
    private readonly getAllByUserOrganization: GetAllByUserOrganizationUseCase,
    private readonly getByIdAddress: GetByIdAddressUseCase,
    private readonly getByIdUserUseCase: GetByIdUserUseCase,
  ) {}

  async execute(userId: number): Promise<OrganizationFilterResponseDto[]> {
    const organizations = await this.getAllByUserOrganization.execute(userId);
    const organizationFilters: OrganizationFilterResponseDto[] = [];

    await Promise.all(
      organizations.map(async (organization) => {
        const address = await this.getByIdAddress.execute(
          organization.addressId,
        );
        const owner = await this.getByIdUserUseCase.execute(
          organization.ownerId,
        );

        organizationFilters.push({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          address: address.location,
          organizationStatus: organization.organizationStatus,
          organizationType: organization.organizationType,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
          owner: owner.surname,
        });
      }),
    );

    return organizationFilters;
  }
}
