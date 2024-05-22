import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: number) {
    const admin = await this.adminRepository.findOneById(input);
    if (!admin) {
      throw new Error('admin not exists');
    }
    admin.status = 'DELETED';
    return await this.adminRepository.update(admin.id, admin);
  }
}
