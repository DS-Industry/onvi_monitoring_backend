import { Injectable } from '@nestjs/common';
import { ITechTaskCommentRepository } from '../interface/techTaskComment';
import { TechTaskCommentResponseDto } from './dto/techTaskComment-response.dto';

@Injectable()
export class ReadTechTaskCommentsUseCase {
  constructor(
    private readonly techTaskCommentRepository: ITechTaskCommentRepository,
  ) {}

  async execute(techTaskId: number): Promise<TechTaskCommentResponseDto[]> {
    const comments = await this.techTaskCommentRepository.findByTechTaskId(techTaskId);

    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      imageUrl: comment.imageUrl,
      techTaskId: comment.techTaskId,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
    }));
  }
}
