import { Injectable } from '@nestjs/common';
import { User } from '@platform-user/user/domain/user';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser, StatusUser } from "@prisma/client";
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { AuthRegisterDto } from '@platform-user/auth/use-cases/dto/auth-register.dto';

@Injectable()
export class RegisterAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(input: AuthRegisterDto): Promise<any> {
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
      position: PositionUser.Owner,
      status: StatusUser.BLOCKED,
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      receiveNotifications: 1,
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
