import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';

@Injectable()
export class GetByIdOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly addressGetByIdUseCase: GetByIdAddressUseCase,
  ) {}

  async execute(input: number): Promise<any> {
    const organization = await this.organizationRepository.findOneById(input);
    if (!organization) {
      throw new Error('organization not exists');
    }
    organization.address = await this.addressGetByIdUseCase.execute(
      organization.addressId,
    );
    return organization;
  }
}
