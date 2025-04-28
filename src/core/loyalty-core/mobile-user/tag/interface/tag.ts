import { Tag } from "@loyalty/mobile-user/tag/domain/tag";

export abstract class ITagRepository {
  abstract create(input: Tag): Promise<Tag>;
  abstract createMany(input: Tag[]): Promise<void>;
  abstract findAll(): Promise<Tag[]>;
  abstract findAllByClientId(clientId: number): Promise<Tag[]>;
  abstract findOneById(id: number): Promise<Tag>;
  abstract findOneByName(name: string): Promise<Tag>;
  abstract delete(input: Tag): Promise<any>;
}