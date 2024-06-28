import { Injectable } from '@nestjs/common';
import { Admin } from '@platform-admin/admin/domain/admin';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { IBcryptAdapter } from '@libs/bcrypt/adapter';

@Injectable()
export class SetRefreshTokenUseCase {
  constructor(
    private readonly adminUpdate: UpdateAdminUseCase,
    private readonly bcrypt: IBcryptAdapter,
  ) {}

  async execute(id: number, token: string): Promise<Admin> {
    const hashedRefreshToken = await this.bcrypt.hash(token);
    return await this.adminUpdate.execute({
      id: id,
      refreshTokenId: hashedRefreshToken,
    });
  }
}
