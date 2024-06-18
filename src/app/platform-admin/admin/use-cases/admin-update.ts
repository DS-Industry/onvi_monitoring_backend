import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { UpdateAdminDto } from '@platform-admin/admin/controller/dto/admin-update.dto';

@Injectable()
export class UpdateAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: UpdateAdminDto) {
    const admin = await this.adminRepository.findOneById(input.id);
    if (!admin) {
      throw new Error('admin not exists');
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
      platformUserRoleId,
    } = input;

    admin.name = name ? name : admin.name;
    admin.surname = surname ? surname : admin.surname;
    admin.middlename = middlename ? middlename : admin.middlename;
    admin.country = country ? country : admin.country;
    admin.countryCode = countryCode ? countryCode : admin.countryCode;
    admin.timezone = timezone ? timezone : admin.timezone;
    admin.avatar = avatar ? avatar : admin.avatar;
    admin.refreshTokenId = refreshTokenId
      ? refreshTokenId
      : admin.refreshTokenId;
    admin.password = password ? password : admin.password;
    admin.status = status ? status : admin.status;
    admin.platformUserRoleId = platformUserRoleId
      ? platformUserRoleId
      : admin.platformUserRoleId;

    return await this.adminRepository.update(admin.id, admin);
  }
}
