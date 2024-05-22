import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { CreateAdminDto } from '@platform-admin/admin/controller/dto/admin-create.dto';
import { Admin } from '@platform-admin/admin/domain/admin';
import { Injectable } from '@nestjs/common';
import { StatusUser } from '@prisma/client';
import { SendConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-send';

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(input: CreateAdminDto): Promise<any> {
    const checkEmail = await this.adminRepository.findOneByEmail(input.email);
    if (checkEmail) {
      throw new Error('email exists');
    }
    if (input.password != input.checkPassword) {
      throw new Error("passwords don't match");
    }

    const hashPassword = await this.bcrypt.hash(input.password);
    const adminData = new Admin({
      name: input.name,
      surname: input.surname,
      middlename: input.middlename,
      birthday: input.birthday,
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

    const admin = await this.adminRepository.create(adminData);

    const sendMail = await this.sendConfirm.execute(
      admin.email,
      'Полная авторизация',
    );
    return { admin, sendMail };
  }
}
