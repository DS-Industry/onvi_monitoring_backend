import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { PositionUser, StatusUser } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { CreateUserDto } from '@platform-user/user/use-cases/dto/user-create.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(input: CreateUserDto): Promise<any> {
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
      position: PositionUser.Operator,
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
