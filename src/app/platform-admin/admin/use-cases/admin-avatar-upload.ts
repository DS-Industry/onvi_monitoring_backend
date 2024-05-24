import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';

@Injectable()
export class UploadAvatarAdminUseCase {
  constructor(private fileService: IFileAdapter) {}

  async execute(input: Express.Multer.File): Promise<string> {
    const key = 'avatar/qwerty';
    return await this.fileService.upload(input, key);
  }
}
