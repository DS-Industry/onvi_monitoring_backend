import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { IConfirmMailRepository } from '@platform-admin/confirmMail/interfaces/confirmMail';

@Injectable()
export class PasswordResetAdminUseCase {
  constructor(
    private readonly conformRepository: IConfirmMailRepository,
    private readonly bcrypt: IBcryptAdapter,
    private readonly adminUpdate: UpdateAdminUseCase,
  ) {}

  async execute(
    admin: Admin,
    password: string,
    chPassword: string,
  ): Promise<any> {
    if (password != chPassword) {
      throw new Error("passwords don't match");
    }

    const hashPassword = await this.bcrypt.hash(password);

    const correctAdmin = await this.adminUpdate.execute({
      id: admin.id,
      password: hashPassword,
    });

    await this.conformRepository.removeOne(correctAdmin.email);

    return { status: 'password change', correctAdmin };
  }
}
