import { Injectable } from '@nestjs/common';
import {
  ITechTaskItemTemplateRepository
} from "@tech-task/itemTemplate/interface/itemTemplate";
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTaskItemTemplate,} from "@tech-task/itemTemplate/domain/itemTemplate";
import { PrismaTechTaskItemTemplateMapper } from '@db/mapper/prisma-tech-task-item-template-mapper';

@Injectable()
export class TechTaskItemTemplateRepository extends ITechTaskItemTemplateRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: TechTaskItemTemplate,
  ): Promise<TechTaskItemTemplate> {
    const techTaskItemTemplateEntity =
      PrismaTechTaskItemTemplateMapper.toPrisma(input);
    const techTaskItemTemplate = await this.prisma.techTaskItemTemplate.create({
      data: techTaskItemTemplateEntity,
    });
    return PrismaTechTaskItemTemplateMapper.toDomain(techTaskItemTemplate);
  }

  public async findOneById(id: number): Promise<TechTaskItemTemplate> {
    const techTaskItemTemplate =
      await this.prisma.techTaskItemTemplate.findFirst({
        where: {
          id,
        },
      });
    return PrismaTechTaskItemTemplateMapper.toDomain(techTaskItemTemplate);
  }

  public async findAll(): Promise<TechTaskItemTemplate[]> {
    const techTaskItemTemplates =
      await this.prisma.techTaskItemTemplate.findMany();
    return techTaskItemTemplates.map((item) =>
      PrismaTechTaskItemTemplateMapper.toDomain(item),
    );
  }

  public async update(
    input: TechTaskItemTemplate,
  ): Promise<TechTaskItemTemplate> {
    const techTaskItemTemplateEntity =
      PrismaTechTaskItemTemplateMapper.toPrisma(input);
    const techTaskItemTemplate = await this.prisma.techTaskItemTemplate.update({
      where: {
        id: input.id,
      },
      data: techTaskItemTemplateEntity,
    });
    return PrismaTechTaskItemTemplateMapper.toDomain(techTaskItemTemplate);
  }
}
