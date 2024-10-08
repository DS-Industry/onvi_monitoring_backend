import { Injectable } from '@nestjs/common';
import { IDocumentsRepository } from '../interfaces/documents';
import { PrismaService } from '@db/prisma/prisma.service';
import { Documents } from '../domain/documents';
import { PrismaDocumentsMapper } from '@db/mapper/prisma-documents-mapper';

@Injectable()
export class DocumentsRepository extends IDocumentsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Documents): Promise<Documents> {
    const documentsPrismaEntity = PrismaDocumentsMapper.toPrisma(input);
    const documents = await this.prisma.organizationDocument.create({
      data: documentsPrismaEntity,
    });
    return PrismaDocumentsMapper.toDomain(documents);
  }

  public async findOneById(id: number): Promise<Documents> {
    const documents = await this.prisma.organizationDocument.findFirst({
      where: {
        id,
      },
    });
    return PrismaDocumentsMapper.toDomain(documents);
  }

  public async update(input: Documents): Promise<Documents> {
    const documentsPrismaEntity = PrismaDocumentsMapper.toPrisma(input);
    const documents = await this.prisma.organizationDocument.update({
      where: {
        id: input.id,
      },
      data: documentsPrismaEntity,
    });
    return PrismaDocumentsMapper.toDomain(documents);
  }
}
