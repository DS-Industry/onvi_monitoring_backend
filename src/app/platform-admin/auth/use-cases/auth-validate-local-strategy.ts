import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { StatusUser } from "@prisma/client";

@Injectable()
export class ValidateAdminForLocalStrategyUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      return null;
    }
    if (admin.status !== StatusUser.ACTIVE) {
      throw new Error('authorization error');
    }
    const checkPassword = await this.bcrypt.compare(password, admin.password);

    if (!checkPassword) {
      throw new Error('password error');
    }

    return admin;
  }
}
