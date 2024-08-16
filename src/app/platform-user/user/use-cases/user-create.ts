import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { CreateUserDto } from '@platform-user/user/controller/dto/user-create.dto';
import { StatusUser } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(input: CreateUserDto): Promise<any> {
    const checkEmail = await this.userRepository.findOneByEmail(input.email);
    if (checkEmail) {
      throw new Error('email exists');
    }
    if (input.password != input.checkPassword) {
      throw new Error("passwords don't match");
    }
    const hashPassword = await this.bcrypt.hash(input.password);
    const userData = new User({
      name: input.name,
      surname: input.surname,
      middlename: input.middlename,
      phone: input.phone,
      email: input.email,
      password: hashPassword,
      avatar: input.avatar,
      country: input.country,
      gender: input.gender,
      countryCode: input.countryCode,
      status: StatusUser.BLOCKED,
      birthday: input.birthday,
      timezone: input.timezone,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userRoleId: input.platformUserRoleId,
    });
    const user = await this.userRepository.create(userData);
    const sendMail = await this.sendConfirm.execute(
      user.email,
      'Полная авторизация',
    );
    return { user, sendMail };
  }
}
