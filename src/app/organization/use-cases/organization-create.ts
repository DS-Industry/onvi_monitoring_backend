import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/interfaces/organization';
import { CreateAddressUseCase } from '@address/use-case/address-create';
import { OrganizationCreateDto } from '@organization/controller/dto/organization-create.dto';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly createAddressUseCase: CreateAddressUseCase,
  ) {}

  async execute(input: OrganizationCreateDto): Promise<any> {

  }
}
