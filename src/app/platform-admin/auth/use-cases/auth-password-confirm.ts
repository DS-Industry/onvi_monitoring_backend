import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { SendConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-send';

@Injectable()
export class PasswordConfirmMailAdminUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly sendConfirm: SendConfirmMailUseCase,
  ) {}

  async execute(email: string): Promise<any> {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      throw new Error('the account was not found');
    }

    return await this.sendConfirm.execute(admin.email, 'Смена пароля');
  }
}
