import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { User } from "@platform-user/user/domain/user";

@Injectable()
export class GetAllUsersOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: number): Promise<User[]> {
    const users = await this.organizationRepository.findAllUser(input);
    if (users.length == 0) {
      throw new Error('users not exists');
    }
    return users;
  }
}
