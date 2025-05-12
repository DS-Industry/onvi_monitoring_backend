import { Injectable } from '@nestjs/common';
import { ITagRepository } from '@loyalty/mobile-user/tag/interface/tag';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';

@Injectable()
export class FindMethodsTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async getAll(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  async getAllByClientId(clientId: number): Promise<Tag[]> {
    return await this.tagRepository.findAllByClientId(clientId);
  }

  async getByName(name: string): Promise<Tag> {
    return await this.tagRepository.findOneByName(name);
  }

  async getById(id: number): Promise<Tag> {
    return await this.tagRepository.findOneById(id);
  }
}
