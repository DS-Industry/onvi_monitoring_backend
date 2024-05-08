import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserRepositoryProvider } from '@platform-user/user/provider/user';
import { UserController } from '@platform-user/user/controller/user';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepositoryProvider, UpdateUserUseCase],
  exports: [UserRepositoryProvider, UpdateUserUseCase],
})
export class UserModule {}
