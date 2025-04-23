import { TechTag } from '@tech-task/tag/domain/techTag';

export abstract class ITechTagRepository {
  abstract create(input: TechTag): Promise<TechTag>;
  abstract createMany(input: TechTag[]): Promise<void>;
  abstract findAll(): Promise<TechTag[]>;
  abstract findAllByTechTaskId(techTaskId: number): Promise<TechTag[]>;
  abstract findOneById(id: number): Promise<TechTag>;
  abstract findOneByName(name: string): Promise<TechTag>;
}
