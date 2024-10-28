import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { TechTaskRepositoryProvider } from '@tech-task/techTask/provider/techTask';
import { TechTaskItemTemplateProvider } from '@tech-task/itemTemplate/provider/itemTemplate';
import { TechTaskItemValueToTechTaskProvider } from '@tech-task/itemTemplateToTechTask/provider/itemValueToTechTask';

const repositories: Provider[] = [
  TechTaskRepositoryProvider,
  TechTaskItemTemplateProvider,
  TechTaskItemValueToTechTaskProvider,
];

@Module({
  imports: [PrismaModule],
  providers: [...repositories],
  exports: [],
})
export class TechTaskModule {}
