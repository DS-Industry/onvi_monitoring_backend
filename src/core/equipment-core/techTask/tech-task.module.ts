import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { TechTaskRepositoryProvider } from '@tech-task/techTask/provider/techTask';
import { TechTaskItemTemplateProvider } from '@tech-task/itemTemplate/provider/itemTemplate';
import { TechTaskItemValueToTechTaskProvider } from '@tech-task/itemTemplateToTechTask/provider/itemValueToTechTask';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { HandlerTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-handler';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { ManageAllByPosAndStatusesTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-manage-all-by-pos-and-statuses';
import { ShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-shape';
import { CompletionShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-completion-shape';
import { ProgramTechRateProvider } from '@tech-task/programTechRate/provider/programTechRate';
import { FindMethodsProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-find-methods';
import { GeneratingReportProgramTechRate } from '@tech-task/programTechRate/use-cases/programTechRate-generating-report';
import { ReadAllByPosTechTaskUseCase } from "@tech-task/techTask/use-cases/techTask-read-all-by-pos";

const repositories: Provider[] = [
  TechTaskRepositoryProvider,
  TechTaskItemTemplateProvider,
  TechTaskItemValueToTechTaskProvider,
  ProgramTechRateProvider,
];

const techTaskUseCases: Provider[] = [
  CreateTechTaskUseCase,
  FindMethodsTechTaskUseCase,
  UpdateTechTaskUseCase,
  HandlerTechTaskUseCase,
  ManageAllByPosAndStatusesTechTaskUseCase,
  ReadAllByPosTechTaskUseCase,
  ShapeTechTaskUseCase,
  CompletionShapeTechTaskUseCase,
];

const itemTemplateUseCases: Provider[] = [FindMethodsItemTemplateUseCase];

const itemTemplateToTechTaskUseCases: Provider[] = [
  FindMethodsItemTemplateToTechTaskUseCase,
];

const programTechRateUseCases: Provider[] = [
  FindMethodsProgramTechRateUseCase,
  GeneratingReportProgramTechRate,
];

@Module({
  imports: [PrismaModule],
  providers: [
    ...repositories,
    ...techTaskUseCases,
    ...itemTemplateUseCases,
    ...itemTemplateToTechTaskUseCases,
    ...programTechRateUseCases,
  ],
  exports: [
    ...techTaskUseCases,
    ...itemTemplateUseCases,
    ...itemTemplateToTechTaskUseCases,
    ...programTechRateUseCases,
  ],
})
export class TechTaskModule {}
