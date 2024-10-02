import { Injectable } from "@nestjs/common";
import { IUserRepository } from "@platform-user/user/interfaces/user";

@Injectable()
export class GetByEmailUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string) {
    return await this.userRepository.findOneByEmail(email);
  }
}
