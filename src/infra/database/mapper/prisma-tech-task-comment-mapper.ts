import {
  TechTaskComment as PrismaTechTaskComment,
  User,
  Prisma,
} from '@prisma/client';
import { TechTaskComment } from '@tech-task/comment/domain/techTaskComment';

export class PrismaTechTaskCommentMapper {
  static toDomain(
    entity: PrismaTechTaskComment & {
      author?: Pick<User, 'id' | 'name' | 'surname'>;
    },
  ): TechTaskComment {
    if (!entity) {
      return null;
    }
    return new TechTaskComment({
      id: entity.id,
      content: entity.content,
      imageUrl: entity.imageUrl,
      techTaskId: entity.techTaskId,
      authorId: entity.authorId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      author: entity.author
        ? {
            id: entity.author.id,
            firstName: entity.author.name,
            lastName: entity.author.surname,
          }
        : undefined,
    });
  }

  static toPrisma(
    comment: TechTaskComment,
  ): Prisma.TechTaskCommentUncheckedCreateInput {
    return {
      id: comment.id,
      content: comment.content,
      imageUrl: comment.imageUrl,
      techTaskId: comment.techTaskId,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
