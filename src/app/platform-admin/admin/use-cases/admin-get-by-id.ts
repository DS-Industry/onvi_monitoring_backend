import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';

@Injectable()
export class GetByIdAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: number) {
    const admin = await this.adminRepository.findOneById(input);
    if (!admin) {
      throw new Error('admin not exists');
    }
    return admin;
  }
}
