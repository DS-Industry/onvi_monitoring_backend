import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { CreateAdminDto } from '@platform-admin/admin/use-cases/dto/admin-create.dto';
import { Admin } from '@platform-admin/admin/domain/admin';
import { Injectable } from '@nestjs/common';
import { GetByEmailAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-email';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { SignRefreshTokenUseCase } from '@platform-admin/auth/use-cases/sign-refresh-token';

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly adminUpdate: UpdateAdminUseCase,
    private readonly bcrypt: IBcryptAdapter,
    private readonly refreshToken: SignRefreshTokenUseCase,
  ) {}

  async execute(input: CreateAdminDto): Promise<Admin> {
    const checkEmail = await this.adminRepository.findOneByEmail(
      input.email,
    );
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
      status: input.status,
      avatar: input.avatar,
      country: input.country,
      countryCode: input.countryCode,
      timezone: input.timezone,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    const admin = await this.adminRepository.create(adminData);

    if (!admin) {
      throw new Error('error create admin');
    }

    const refreshToken = await this.refreshToken.execute(admin.email, admin.id);
    return await this.adminUpdate.execute({
      id: admin.id,
      refreshTokenId: refreshToken.token,
    });
  }
}
