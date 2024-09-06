import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';

@Injectable()
export class DownloadAvatarClientUseCase {
  constructor(private fileService: IFileAdapter) {}

  async execute(input: string): Promise<any> {
    return await this.fileService.download('avatar/client/' + input);
  }
}
