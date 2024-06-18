import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { GetByEmailUserDto } from '@platform-user/user/controller/dto/user-get-by-email.dto';

@Injectable()
export class GetByEmailUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetByEmailUserDto) {
    const user = await this.userRepository.findOneByEmail(input.email);
    if (!user) {
      throw new Error('user not exists');
    }
    return user;
  }
}
