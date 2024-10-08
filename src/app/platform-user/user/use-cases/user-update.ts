import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { UpdateUserDto } from '@platform-user/user/use-cases/dto/user-update.dto';
import { v4 as uuid } from 'uuid';
import { IFileAdapter } from '@libs/file/adapter';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly bcrypt: IBcryptAdapter,
    private userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateUserDto, file?: Express.Multer.File) {
    const user = await this.userRepository.findOneById(input.id);
    const {
      name,
      surname,
      middlename,
      password,
      phone,
      email,
      position,
      status,
      refreshTokenId,
      receiveNotifications,
      roleId,
    } = input;

    if (file) {
      if (user.avatar) {
        await this.fileService.delete('avatar/user/' + user.avatar);
      }
      const key = uuid();
      user.avatar = key;
      const keyWay = 'avatar/user/' + key;
      await this.fileService.upload(file, keyWay);
    }

    if (password) {
      user.password = await this.bcrypt.hash(password);
    }

    user.name = name ? name : user.name;
    user.surname = surname ? surname : user.surname;
    user.middlename = middlename ? middlename : user.middlename;
    user.phone = phone ? phone : user.phone;
    user.email = email ? email : user.email;
    user.position = position ? position : user.position;
    user.status = status ? status : user.status;
    user.refreshTokenId = refreshTokenId ? refreshTokenId : user.refreshTokenId;
    user.receiveNotifications = receiveNotifications
      ? receiveNotifications
      : user.receiveNotifications;
    user.userRoleId = roleId ? roleId : user.userRoleId;

    return await this.userRepository.update(user.id, user);
  }
}
