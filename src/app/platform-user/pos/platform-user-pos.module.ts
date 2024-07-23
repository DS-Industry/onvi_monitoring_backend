import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { PosController } from '@platform-user/pos/controller/pos';
import { PreCreatePosUseCase } from '@platform-user/pos/use-cases/pos-pre-create';

@Module({
  imports: [BusinessCoreModule],
  controllers: [PosController],
  providers: [PreCreatePosUseCase],
})
export class PlatformUserPosModule {}
