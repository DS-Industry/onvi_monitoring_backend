import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadAvatarUserUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly updateUser: UpdateUserUseCase,
    private readonly getByIdUser: GetByIdUserUseCase,
  ) {}

  async execute(file: Express.Multer.File, id: number): Promise<string> {
    const user = await this.getByIdUser.execute(id);
    if (user.avatar) {
      await this.fileService.delete('avatar/user/' + user.avatar);
    }
    const key = uuid();
    user.avatar = key;
    await this.updateUser.execute(user);
    const keyWay = 'avatar/user/' + key;
    return await this.fileService.upload(file, keyWay);
  }
}
