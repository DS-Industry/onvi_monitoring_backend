import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { GetByIdAddressUseCase } from '../../../address/use-case/address-get-by-id';

@Injectable()
export class GetByNameOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly addressGetByIdUseCase: GetByIdAddressUseCase,
  ) {}

  async execute(input: string): Promise<any> {
    const organization = await this.organizationRepository.findOneByName(input);
    if (!organization) {
      throw new Error('organization not exists');
    }
    organization.address = await this.addressGetByIdUseCase.execute(
      organization.addressId,
    );
    return organization;
  }
}
