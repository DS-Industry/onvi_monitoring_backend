import { Injectable } from '@nestjs/common';
import { ITagRepository } from '@loyalty/mobile-user/tag/interface/tag';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';

@Injectable()
export class CreateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(name: string, color: string): Promise<Tag> {
    const tag = new Tag({ name: name, color: color });
    return await this.tagRepository.create(tag);
  }
}
