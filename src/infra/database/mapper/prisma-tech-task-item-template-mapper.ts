import {
  TechTaskItemTemplate as PrismaTechTaskItemTemplate,
  Prisma,
} from '@prisma/client';
import { TechTaskItemTemplate } from '@tech-task/itemTemplate/domain/itemTemplate';

export class PrismaTechTaskItemTemplateMapper {
  static toDomain(entity: PrismaTechTaskItemTemplate): TechTaskItemTemplate {
    if (!entity) {
      return null;
    }
    return new TechTaskItemTemplate({
      id: entity.id,
      title: entity.title,
      type: entity.type,
      group: entity.group,
    });
  }

  static toPrisma(
    techTaskItemTemplate: TechTaskItemTemplate,
  ): Prisma.TechTaskItemTemplateUncheckedCreateInput {
    return {
      id: techTaskItemTemplate?.id,
      title: techTaskItemTemplate.title,
      type: techTaskItemTemplate.type,
      group: techTaskItemTemplate.group,
    };
  }
}
