import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { UserRepositoryProvider } from '@platform-user/user/provider/user';
import { UserController } from '@platform-user/user/controller/user';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepositoryProvider],
})
export class UserModule {}
