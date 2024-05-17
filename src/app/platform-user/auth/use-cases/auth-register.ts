import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from '@platform-user/auth/controller/dto/auth-register.dto';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { StatusUser } from '@prisma/client';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(input: AuthRegisterDto): Promise<any> {
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
      birthday: input.birthday,
      userRoleId: 1,
      phone: input.phone,
      email: input.email,
      password: hashPassword,
      gender: input.gender,
      status: StatusUser.BLOCKED,
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const user = await this.userRepository.create(userData);

    const sendMail = await this.sendConfirm.execute(
      user.email,
      'Полная авторизация',
    );

    return { user, sendMail };
  }
}
