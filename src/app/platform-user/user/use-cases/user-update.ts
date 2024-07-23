import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { UpdateUserDto } from '@platform-user/user/controller/dto/user-update.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: UpdateUserDto) {
    const user = await this.userRepository.findOneById(input.id);
    if (!user) {
      throw new Error('user not exists');
    }
    const {
      name,
      surname,
      middlename,
      country,
      countryCode,
      timezone,
      avatar,
      refreshTokenId,
      password,
      status,
      userRoleId,
    } = input;

    user.name = name ? name : user.name;
    user.surname = surname ? surname : user.surname;
    user.middlename = middlename ? middlename : user.middlename;
    user.country = country ? country : user.country;
    user.countryCode = countryCode ? countryCode : user.countryCode;
    user.timezone = timezone ? timezone : user.timezone;
    user.avatar = middlename ? avatar : user.avatar;
    user.refreshTokenId = refreshTokenId ? refreshTokenId : user.refreshTokenId;
    user.password = password ? password : user.password;
    user.status = status ? status : user.status;
    user.userRoleId = userRoleId ? userRoleId : user.userRoleId;

    return await this.userRepository.update(user.id, user);
  }
}
