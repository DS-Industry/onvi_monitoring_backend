import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { TechTaskRepositoryProvider } from '@tech-task/techTask/provider/techTask';
import { TechTaskItemTemplateProvider } from '@tech-task/itemTemplate/provider/itemTemplate';
import { TechTaskItemValueToTechTaskProvider } from '@tech-task/itemTemplateToTechTask/provider/itemValueToTechTask';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { DeleteTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-delete';
import { DeleteManyTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-delete-many';
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
import { ReadAllByPosTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-read-all-by-pos';
import { GetAllByPosIdProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-get-all-by-pos-id';
import { UpdateProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-update';
import { FileModule } from '@libs/file/module';
import { TechTagRepositoryProvider } from '@tech-task/tag/provider/techTag';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { CreateTechTagUseCase } from '@tech-task/tag/use-case/techTag-create';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportTechTaskUseCase } from "@tech-task/techTask/use-cases/techTask-report";

const repositories: Provider[] = [
  TechTaskRepositoryProvider,
  TechTaskItemTemplateProvider,
  TechTaskItemValueToTechTaskProvider,
  ProgramTechRateProvider,
  TechTagRepositoryProvider,
];

const techTaskUseCases: Provider[] = [
  CreateTechTaskUseCase,
  DeleteTechTaskUseCase,
  DeleteManyTechTaskUseCase,
  FindMethodsTechTaskUseCase,
  UpdateTechTaskUseCase,
  HandlerTechTaskUseCase,
  ManageAllByPosAndStatusesTechTaskUseCase,
  ReadAllByPosTechTaskUseCase,
  ShapeTechTaskUseCase,
  CompletionShapeTechTaskUseCase,
  ReportTechTaskUseCase,
];

const itemTemplateUseCases: Provider[] = [FindMethodsItemTemplateUseCase];

const itemTemplateToTechTaskUseCases: Provider[] = [
  FindMethodsItemTemplateToTechTaskUseCase,
];

const programTechRateUseCases: Provider[] = [
  FindMethodsProgramTechRateUseCase,
  GeneratingReportProgramTechRate,
  GetAllByPosIdProgramTechRateUseCase,
  UpdateProgramTechRateUseCase,
];

const tagUseCases: Provider[] = [
  CreateTechTagUseCase,
  FindMethodsTechTagUseCase,
];

@Module({
  imports: [PrismaModule, FileModule, ScheduleModule.forRoot()],
  providers: [
    ...repositories,
    ...techTaskUseCases,
    ...itemTemplateUseCases,
    ...itemTemplateToTechTaskUseCases,
    ...programTechRateUseCases,
    ...tagUseCases,
  ],
  exports: [
    ...repositories,
    ...techTaskUseCases,
    ...itemTemplateUseCases,
    ...itemTemplateToTechTaskUseCases,
    ...programTechRateUseCases,
    ...tagUseCases,
  ],
})
export class TechTaskModule {}
