import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';

@Injectable()
export class ValidateUserForJwtStrategyUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      throw new Error('email not exists');
    }
    return admin;
  }
}
