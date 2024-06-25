import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';

@Injectable()
export class GetByIdUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: number) {
    const user = await this.userRepository.findOneById(input);
    if (!user) {
      throw new Error('user not exists');
    }
    return user;
  }
}
