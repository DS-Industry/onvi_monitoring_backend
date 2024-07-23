import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { v4 as uuid } from 'uuid';
import { UpdateAdminUseCase } from '@platform-admin/admin/use-cases/admin-update';
import { GetByIdAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-id';

@Injectable()
export class UploadAvatarAdminUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly updateAdmin: UpdateAdminUseCase,
    private readonly getByIdAdmin: GetByIdAdminUseCase,
  ) {}

  async execute(file: Express.Multer.File, id: number): Promise<string> {
    const admin = await this.getByIdAdmin.execute(id);
    if (admin.avatar) {
      await this.fileService.delete('avatar/admin/' + admin.avatar);
    }
    const key = uuid();
    admin.avatar = key;
    await this.updateAdmin.execute(admin);
    const keyWay = 'avatar/admin/' + key;
    return await this.fileService.upload(file, keyWay);
  }
}
