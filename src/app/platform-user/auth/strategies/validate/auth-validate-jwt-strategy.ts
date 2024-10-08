import { Injectable } from '@nestjs/common';
import { IUserRepository } from "@platform-user/user/interfaces/user";
import { User } from "@platform-user/user/domain/user";

@Injectable()
export class ValidateUserForJwtStrategyUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new Error('email not exists');
    }
    return user;
  }
}
