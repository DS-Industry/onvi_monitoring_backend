import { Injectable } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { GetByIdAdminDto } from '@platform-admin/admin/use-cases/dto/admin-get-by-id.dto';

@Injectable()
export class GetByIdAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(input: GetByIdAdminDto) {
    const admin = await this.adminRepository.findOneById(input.id);
    if (!admin) {
      throw new Error('admin not exists');
    }
    return admin;
  }
}
