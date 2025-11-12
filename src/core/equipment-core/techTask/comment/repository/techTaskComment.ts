import { Injectable } from '@nestjs/common';
import { ITechTaskCommentRepository } from '../interface/techTaskComment';
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTaskComment } from '../domain/techTaskComment';
import { PrismaTechTaskCommentMapper } from '@db/mapper/prisma-tech-task-comment-mapper';

@Injectable()
export class TechTaskCommentRepository extends ITechTaskCommentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(comment: TechTaskComment): Promise<TechTaskComment> {
    const commentEntity = PrismaTechTaskCommentMapper.toPrisma(comment);
    const createdComment = await this.prisma.techTaskComment.create({
      data: commentEntity,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });
    return PrismaTechTaskCommentMapper.toDomain(createdComment);
  }

  public async findByTechTaskId(
    techTaskId: number,
  ): Promise<TechTaskComment[]> {
    const comments = await this.prisma.techTaskComment.findMany({
      where: {
        techTaskId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return comments.map((comment) =>
      PrismaTechTaskCommentMapper.toDomain(comment),
    );
  }

  public async findById(id: number): Promise<TechTaskComment | null> {
    const comment = await this.prisma.techTaskComment.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    return comment ? PrismaTechTaskCommentMapper.toDomain(comment) : null;
  }

  public async update(comment: TechTaskComment): Promise<TechTaskComment> {
    const commentEntity = PrismaTechTaskCommentMapper.toPrisma(comment);
    const updatedComment = await this.prisma.techTaskComment.update({
      where: {
        id: comment.id,
      },
      data: commentEntity,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });
    return PrismaTechTaskCommentMapper.toDomain(updatedComment);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.techTaskComment.delete({
      where: {
        id,
      },
    });
  }
}
