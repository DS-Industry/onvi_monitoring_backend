import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ManagerPaperRepositoryProvider } from '@manager-paper/managerPaper/provider/managerPaper';
import { ManagerPaperTypeRepositoryProvider } from '@manager-paper/managerPaperType/provider/managerPaperType';
import { ManagerReportPeriodRepositoryProvider } from '@manager-paper/managerReportPeriod/provider/managerReportPeriod';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { FindMethodsManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-find-methods';
import { FindMethodsManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-find-methods';
import { CreateManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-create';
import { UpdateManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-update';
import { FileModule } from '@libs/file/module';
import { CreateManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-create';
import { UpdateManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-update';
import { DeleteManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-delete';
import { CreateManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-create';
import { UpdateManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-update';
import { GetAllByFilterManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-get-all-by-filter';
import { GetDetailManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-get-detail';
import { DeleteManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-delete';
import { HandlerManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-handler';
import { StatisticManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-statistic';
import { ManagerPaperHandlerEventUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-handler-event';

const repositories: Provider[] = [
  ManagerPaperRepositoryProvider,
  ManagerPaperTypeRepositoryProvider,
  ManagerReportPeriodRepositoryProvider,
];

const managerPaperUseCases: Provider[] = [
  CreateManagerPaperUseCase,
  UpdateManagerPaperUseCase,
  DeleteManagerPaperUseCase,
  FindMethodsManagerPaperUseCase,
  StatisticManagerPaperUseCase,
  ManagerPaperHandlerEventUseCase,
];

const managerPaperTypeUseCases: Provider[] = [
  CreateManagerPaperTypeUseCase,
  UpdateManagerPaperTypeUseCase,
  FindMethodsManagerPaperTypeUseCase,
];

const managerReportPeriodUseCases: Provider[] = [
  CreateManagerReportPeriodUseCase,
  FindMethodsManagerReportPeriodUseCase,
  UpdateManagerReportPeriodUseCase,
  GetAllByFilterManagerReportPeriodUseCase,
  GetDetailManagerReportPeriodUseCase,
  DeleteManagerReportPeriodUseCase,
  HandlerManagerReportPeriodUseCase,
];
@Module({
  imports: [PrismaModule, FileModule],
  providers: [
    ...repositories,
    ...managerPaperUseCases,
    ...managerPaperTypeUseCases,
    ...managerReportPeriodUseCases,
  ],
  exports: [
    ...managerPaperUseCases,
    ...managerPaperTypeUseCases,
    ...managerReportPeriodUseCases,
  ],
})
export class ManagerPaperCoreModule {}
