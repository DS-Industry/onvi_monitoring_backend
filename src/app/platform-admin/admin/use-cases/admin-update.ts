import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { UpdateAdminDto } from '@platform-admin/admin/use-cases/dto/admin-update.dto';

@Injectable()
export class UpdateAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: UpdateAdminDto) {
    const admin = await this.adminRepository.findOneById(input.id);
    if (!admin) {
      throw new Error('admin not exists');
    }
  }
}
