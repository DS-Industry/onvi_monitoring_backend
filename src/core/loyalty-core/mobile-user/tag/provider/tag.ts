import { Provider } from '@nestjs/common';
import { ITagRepository } from '@loyalty/mobile-user/tag/interface/tag';
import { TagRepository } from '@loyalty/mobile-user/tag/repository/tag';

export const TagRepositoryProvider: Provider = {
  provide: ITagRepository,
  useClass: TagRepository,
};
