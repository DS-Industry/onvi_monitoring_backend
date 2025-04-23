import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { Provider } from '@nestjs/common';
import { TechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/repository/itemValueToTechTask';

export const TechTaskItemValueToTechTaskProvider: Provider = {
  provide: ITechTaskItemValueToTechTaskRepository,
  useClass: TechTaskItemValueToTechTaskRepository,
};
