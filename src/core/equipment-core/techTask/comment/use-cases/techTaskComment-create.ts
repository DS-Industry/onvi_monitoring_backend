import { Injectable } from '@nestjs/common';
import { ITechTaskCommentRepository } from '../interface/techTaskComment';
import { TechTaskComment } from '../domain/techTaskComment';
import { TechTaskCommentCreateDto } from '../../../../../app/platform-user/core-controller/dto/receive/tech-task-comment-create.dto';
import { TechTaskCommentResponseDto } from './dto/techTaskComment-response.dto';

@Injectable()
export class CreateTechTaskCommentUseCase {
  constructor(
    private readonly techTaskCommentRepository: ITechTaskCommentRepository,
  ) {}

  async execute(
    data: TechTaskCommentCreateDto,
    techTaskId: number,
    authorId: number,
  ): Promise<TechTaskCommentResponseDto> {
    const comment = new TechTaskComment({
      content: data.content,
      imageUrl: data.imageUrl,
      techTaskId: techTaskId,
      authorId: authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdComment = await this.techTaskCommentRepository.create(comment);

    return {
      id: createdComment.id,
      content: createdComment.content,
      imageUrl: createdComment.imageUrl,
      techTaskId: createdComment.techTaskId,
      authorId: createdComment.authorId,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
      author: createdComment.author,
    };
  }
}
