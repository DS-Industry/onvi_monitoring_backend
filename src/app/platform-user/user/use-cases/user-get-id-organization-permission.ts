import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class GetIdOrganizationPermissionUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute(input: number): Promise<number[]> {
    return await this.userRepository.getAllOrganizationPermissions(input);
  }
}
