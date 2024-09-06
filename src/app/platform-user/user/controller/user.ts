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
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';
import { DownloadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-download';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarUserDto } from '@platform-user/user/controller/dto/user-upload-avatar.dto';
import { UploadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-upload';

@Controller('user')
export class UserController {
  constructor(
    private readonly userGetById: GetByIdUserUseCase,
    private readonly userDownloadAvatar: DownloadAvatarUserUseCase,
    private readonly userUploadAvatar: UploadAvatarUserUseCase,
  ) {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      const user = this.userGetById.execute(id);
      console.log(user);
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() data: any): Promise<any> {
    try {
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() data: UploadAvatarUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.userUploadAvatar.execute(file, Number(data.id));
    } catch (e) {
      throw new Error(e);
    }
  }
  @Get('avatar/:key')
  async download(@Param('key') key: string) {
    try {
      return this.userDownloadAvatar.execute(key);
    } catch (e) {
      throw new Error(e);
    }
  }
}
