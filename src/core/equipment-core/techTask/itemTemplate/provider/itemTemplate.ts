import { Provider } from '@nestjs/common';
import { ITechTaskItemTemplateRepository } from '@tech-task/itemTemplate/interface/itemTemplate';
import { TechTaskItemTemplateRepository } from '@tech-task/itemTemplate/repository/itemTemplate';

export const TechTaskItemTemplateProvider: Provider = {
  provide: ITechTaskItemTemplateRepository,
  useClass: TechTaskItemTemplateRepository,
};
