import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { FileModule } from '@libs/file/module';
import { ClientRepositoryProvider } from './mobile-user/client/provider/client';
import { UpdateClientUseCase } from './mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from './mobile-user/client/use-cases/client-get-by-id';
import { UploadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-upload';
import { DownloadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-download';
import { TagRepositoryProvider } from '@loyalty/mobile-user/tag/provider/tag';
import { CardRepositoryProvider } from '@loyalty/mobile-user/card/provider/card';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { CreateTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-create';
import { DeleteTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-delete';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CreateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-create';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { FindByFilterClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-by-filter';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';

const repositories: Provider[] = [
  ClientRepositoryProvider,
  TagRepositoryProvider,
  CardRepositoryProvider,
];

const clientUseCase: Provider[] = [
  CreateClientUseCase,
  UpdateClientUseCase,
  GetByIdClientUseCase,
  UploadAvatarClientUseCase,
  DownloadAvatarClientUseCase,
  FindMethodsClientUseCase,
  FindByFilterClientUseCase,
];

const tagUseCase: Provider[] = [
  CreateTagUseCase,
  DeleteTagUseCase,
  FindMethodsTagUseCase,
];

const cardUseCase: Provider[] = [
  CreateCardUseCase,
  UpdateCardUseCase,
  FindMethodsCardUseCase,
];
@Module({
  imports: [PrismaModule, FileModule],
  providers: [...repositories, ...clientUseCase, ...tagUseCase, ...cardUseCase],
  exports: [...repositories, ...clientUseCase, ...tagUseCase, ...cardUseCase],
})
export class LoyaltyCoreModule {}
