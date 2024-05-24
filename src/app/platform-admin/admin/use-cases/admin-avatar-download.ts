import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';

@Injectable()
export class DownloadAvatarAdminUseCase {
  constructor(private fileService: IFileAdapter) {}

  async execute(input: string): Promise<any> {
    return await this.fileService.download(input);
  }
}
