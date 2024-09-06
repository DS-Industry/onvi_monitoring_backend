import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { PosController } from '@platform-user/pos/controller/pos';
import { PreCreatePosUseCase } from '@platform-user/pos/use-cases/pos-pre-create';
import { FilterByUserPosUseCase } from '@platform-user/pos/use-cases/pos-filter-by-user';
import { UserModule } from '@platform-user/user/user.module';
import { MonitoringPosUseCase } from '@platform-user/pos/use-cases/pos-monitoring';
import { MonitoringFullByIdPosUseCase } from "@platform-user/pos/use-cases/pos-monitoring-full-by-id";
import { ProgramPosUseCase } from "@platform-user/pos/use-cases/pos-program";
import { PosProgramFullUseCase } from "@platform-user/pos/use-cases/pos-program-full";

@Module({
  imports: [UserModule, BusinessCoreModule],
  controllers: [PosController],
  providers: [
    PreCreatePosUseCase,
    FilterByUserPosUseCase,
    MonitoringPosUseCase,
    MonitoringFullByIdPosUseCase,
    ProgramPosUseCase,
    PosProgramFullUseCase
  ],
})
export class PlatformUserPosModule {}
