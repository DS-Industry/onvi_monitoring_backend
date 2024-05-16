import { Injectable } from '@nestjs/common';
import { ValidateConfirmMailUseCase } from '@platform-admin/confirmMail/use-case/confirm-mail-validate';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';

@Injectable()
export class ValidateAdminEmailStrategyUseCase {
  constructor(
    private readonly validateConfirmEmailUseCase: ValidateConfirmMailUseCase,
    private readonly adminRepository: IAdminRepository,
  ) {}

  async execute(email: string, confirmString: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      return null;
    }
    const checkConfirmMail = await this.validateConfirmEmailUseCase.execute(
      email,
      confirmString,
    );
    if (!checkConfirmMail) {
      throw new Error('confirmMail error');
    }

    return admin;
  }
}
