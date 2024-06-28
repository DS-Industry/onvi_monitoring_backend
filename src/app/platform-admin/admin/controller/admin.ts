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
import { CreateAdminUseCase } from '@platform-admin/admin/use-cases/admin-create';
import { GetByIdAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-id';
import { CreateAdminDto } from '@platform-admin/admin/controller/dto/admin-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarAdminUseCase } from '@platform-admin/admin/use-cases/admin-avatar-upload';
import { DownloadAvatarAdminUseCase } from '@platform-admin/admin/use-cases/admin-avatar-download';
import { UploadAvatarAdminDto } from '@platform-admin/admin/controller/dto/admin-upload-avatar.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminCreate: CreateAdminUseCase,
    private readonly adminGetById: GetByIdAdminUseCase,
    private readonly adminUploadAvatar: UploadAvatarAdminUseCase,
    private readonly adminDownloadAvatar: DownloadAvatarAdminUseCase,
  ) {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.adminGetById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() data: CreateAdminDto): Promise<any> {
    try {
      return this.adminCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() data: UploadAvatarAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.adminUploadAvatar.execute(file, Number(data.id));
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('avatar/:key')
  async download(@Param('key') key: string) {
    try {
      return this.adminDownloadAvatar.execute(key);
    } catch (e) {
      throw new Error(e);
    }
  }
}
