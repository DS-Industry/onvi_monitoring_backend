import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class FindMethodsUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getByEmail(input: string) {
    return await this.userRepository.findOneByEmail(input);
  }

  async getById(input: number) {
    return await this.userRepository.findOneById(input);
  }

  async getOrgPermissionById(input: number): Promise<number[]> {
    return await this.userRepository.getAllOrganizationPermissions(input);
  }

  async getPosPermissionById(input: number): Promise<number[]> {
    return await this.userRepository.getAllPosPermissions(input);
  }
}
