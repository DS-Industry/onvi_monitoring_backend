import { Provider } from '@nestjs/common';
import { ITechTaskCommentRepository } from '../interface/techTaskComment';
import { TechTaskCommentRepository } from '../repository/techTaskComment';

export const TechTaskCommentProvider: Provider = {
  provide: ITechTaskCommentRepository,
  useClass: TechTaskCommentRepository,
};

