import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DownloadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-download';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { UpdateUserDto } from '@platform-user/user/controller/dto/user-update.dto';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { UserPasswordResetDto } from '@platform-user/user/controller/dto/user-password-reset.dto';
import { UserValidateRules } from '@platform-user/validate/validate-rules/user-validate-rules';
import { GetAllPermissionsInfoUseCases } from '@platform-user/permissions/use-cases/get-all-permissions-info';

@Controller('')
export class UserController {
  constructor(
    private readonly userDownloadAvatar: DownloadAvatarUserUseCase,
    private readonly userUpdate: UpdateUserUseCase,
    private readonly userValidateRules: UserValidateRules,
    private readonly getAllPermissionsInfoUseCases: GetAllPermissionsInfoUseCases,
  ) {}
  @Get('')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getOneById(@Request() req: any): Promise<any> {
    try {
      const { user } = req;
      const permissionInfo =
        await this.getAllPermissionsInfoUseCases.getPermissionsInfoForUser(
          user,
        );
      return { ...user, permissionInfo };
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async update(
    @Request() req: any,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    try {
      const { user } = req;
      const updateData = {
        ...body,
        id: user.id,
      };
      if (file) {
        return this.userUpdate.execute(updateData, file);
      } else {
        return this.userUpdate.execute(updateData);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('password')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async resetPassword(
    @Request() req: any,
    @Body() body: UserPasswordResetDto,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.userValidateRules.resetPasswordValidate(
        body.oldPassword,
        user.password,
      );
      return this.userUpdate.execute({
        id: user.id,
        password: body.newPassword,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('avatar')
  @UseGuards(JwtGuard)
  async download(@Request() req: any) {
    try {
      const { user } = req;
      return this.userDownloadAvatar.execute(user.avatar);
    } catch (e) {
      throw new Error(e);
    }
  }
}
