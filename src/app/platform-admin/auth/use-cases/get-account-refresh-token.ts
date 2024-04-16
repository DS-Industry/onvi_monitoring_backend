import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';

@Injectable()
export class GetAccountIfRefreshTokenMatchesUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(refreshToken: string, email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneByEmail(email);
    if (!admin) {
      throw new Error('email not exists');
    }

    const isRefreshingTokenMatching = await this.bcrypt.compare(
      refreshToken,
      admin.refreshTokenId,
    );

    if (isRefreshingTokenMatching) {
      return admin;
    }
  }
}
