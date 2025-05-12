import { Provider } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskRepository } from '@tech-task/techTask/repository/techTask';

export const TechTaskRepositoryProvider: Provider = {
  provide: ITechTaskRepository,
  useClass: TechTaskRepository,
};
