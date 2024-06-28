import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetByIdClientUseCase } from '@mobile-user/client/use-cases/client-get-by-id';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarClientDto } from '@mobile-user/client/controller/dto/client-upload-avatar';
import { UploadAvatarClientUseCase } from '@mobile-user/client/use-cases/client-avatar-upload';
import { DownloadAvatarClientUseCase } from '@mobile-user/client/use-cases/client-avatar-download';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientGetById: GetByIdClientUseCase,
    private readonly clientUploadAvatar: UploadAvatarClientUseCase,
    private readonly clientDownloadAvatar: DownloadAvatarClientUseCase,
  ) {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.clientGetById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() data: UploadAvatarClientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.clientUploadAvatar.execute(file, Number(data.id));
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('avatar/:key')
  async download(@Param('key') key: string) {
    try {
      return this.clientDownloadAvatar.execute(key);
    } catch (e) {
      throw new Error(e);
    }
  }
}
