import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserRepositoryProvider } from '@platform-user/user/provider/user';
import { UserController } from '@platform-user/user/controller/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';
import { GetByEmailUserUseCase } from '@platform-user/user/use-cases/user-get-by-email';
import { UploadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-upload';
import { DownloadAvatarUserUseCase } from '@platform-user/user/use-cases/user-avatar-download';
import { FileModule } from '@libs/file/module';

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [UserController],
  providers: [
    UserRepositoryProvider,
    UpdateUserUseCase,
    GetByIdUserUseCase,
    GetByEmailUserUseCase,
    UploadAvatarUserUseCase,
    DownloadAvatarUserUseCase,
  ],
  exports: [
    UserRepositoryProvider,
    UpdateUserUseCase,
    GetByIdUserUseCase,
    GetByEmailUserUseCase,
  ],
})
export class UserModule {}
