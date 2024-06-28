import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';

@Injectable()
export class GetAllUsersOrganization {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: number): Promise<any> {
    const users = await this.organizationRepository.findAllClient(input);
    if (users.length == 0) {
      throw new Error('users not exists');
    }
    return users;
  }
}
