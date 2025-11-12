import { TechTaskItemTemplate } from '@tech-task/itemTemplate/domain/itemTemplate';

export abstract class ITechTaskItemTemplateRepository {
  abstract create(input: TechTaskItemTemplate): Promise<TechTaskItemTemplate>;
  abstract findOneById(id: number): Promise<TechTaskItemTemplate>;
  abstract findAll(): Promise<TechTaskItemTemplate[]>;
  abstract update(input: TechTaskItemTemplate): Promise<TechTaskItemTemplate>;
}
