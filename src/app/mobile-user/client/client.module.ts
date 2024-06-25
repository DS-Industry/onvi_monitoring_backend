import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ClientRepositoryProvider } from '@mobile-user/client/provider/client';
import { ClientController } from '@mobile-user/client/controller/client';
import { UpdateClientUseCase } from '@mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from '@mobile-user/client/use-cases/client-get-by-id';
import { FileModule } from '@libs/file/module';
import { UploadAvatarClientUseCase } from '@mobile-user/client/use-cases/client-avatar-upload';
import { DownloadAvatarClientUseCase } from '@mobile-user/client/use-cases/client-avatar-download';

@Module({
  imports: [PrismaModule, FileModule],
  controllers: [ClientController],
  providers: [
    ClientRepositoryProvider,
    UpdateClientUseCase,
    GetByIdClientUseCase,
    UploadAvatarClientUseCase,
    DownloadAvatarClientUseCase,
  ],
  exports: [ClientRepositoryProvider, UpdateClientUseCase],
})
export class ClientModule {}
