import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { GetByEmailAdminDto } from '@platform-admin/admin/controller/dto/admin-get-by-email.dto';

@Injectable()
export class GetByEmailAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: GetByEmailAdminDto) {
    const admin = await this.adminRepository.findOneByEmail(input.email);
    if (!admin) {
      throw new Error('admin not exists');
    }
    return admin;
  }
}
