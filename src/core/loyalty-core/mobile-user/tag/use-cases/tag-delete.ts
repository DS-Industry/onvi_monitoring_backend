import { Injectable } from '@nestjs/common';
import { ITagRepository } from '@loyalty/mobile-user/tag/interface/tag';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';

@Injectable()
export class DeleteTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(input: Tag): Promise<void> {
    await this.tagRepository.delete(input);
  }
}
