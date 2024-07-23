import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { UpdateClientUseCase } from '@mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from '@mobile-user/client/use-cases/client-get-by-id';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadAvatarClientUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly updateClient: UpdateClientUseCase,
    private readonly getByIdClient: GetByIdClientUseCase,
  ) {}

  async execute(file: Express.Multer.File, id: number): Promise<string> {
    const client = await this.getByIdClient.execute(id);
    if (client.avatar) {
      await this.fileService.delete('avatar/client/' + client.avatar);
    }
    const key = uuid();
    client.avatar = key;
    await this.updateClient.execute(client);
    const keyWay = 'avatar/client/' + key;
    return await this.fileService.upload(file, keyWay);
  }
}
