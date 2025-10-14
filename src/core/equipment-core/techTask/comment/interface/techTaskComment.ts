import { TechTaskComment } from '../domain/techTaskComment';

export abstract class ITechTaskCommentRepository {
  abstract create(comment: TechTaskComment): Promise<TechTaskComment>;
  abstract findByTechTaskId(techTaskId: number): Promise<TechTaskComment[]>;
  abstract findById(id: number): Promise<TechTaskComment | null>;
  abstract update(comment: TechTaskComment): Promise<TechTaskComment>;
  abstract delete(id: number): Promise<void>;
}

