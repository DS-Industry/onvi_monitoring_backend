import { ManagerPaper as PrismaManagerPaper, Prisma } from '@prisma/client';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { ManagerPaperWithTypeDto } from '@manager-paper/managerPaper/use-case/dto/managerPaperWithType.dto';
type PrismaManagerPaperWithPaperType = Prisma.ManagerPaperGetPayload<{
  include: {
    paperType: true;
  };
}>;

export class PrismaManagerPaperMapper {
  static toDomain(entity: PrismaManagerPaper): ManagerPaper {
    if (!entity) {
      return null;
    }
    return new ManagerPaper({
      id: entity.id,
      group: entity.group,
      posId: entity.posId,
      paperTypeId: entity.paperTypeId,
      eventDate: entity.eventDate,
      sum: entity.sum,
      userId: entity.userId,
      imageProductReceipt: entity.imageProductReceipt,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toDomainWithType(
    entity: PrismaManagerPaperWithPaperType,
  ): ManagerPaperWithTypeDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      group: entity.group,
      posId: entity.posId,
      paperTypeId: entity.paperTypeId,
      paperTypeName: entity.paperType.name,
      paperTypeType: entity.paperType.type,
      eventDate: entity.eventDate,
      sum: entity.sum,
      userId: entity.userId,
      imageProductReceipt: entity.imageProductReceipt,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    };
  }

  static toPrisma(
    managerPaper: ManagerPaper,
  ): Prisma.ManagerPaperUncheckedCreateInput {
    return {
      id: managerPaper?.id,
      group: managerPaper.group,
      posId: managerPaper.posId,
      paperTypeId: managerPaper.paperTypeId,
      eventDate: managerPaper.eventDate,
      sum: managerPaper.sum,
      userId: managerPaper.userId,
      imageProductReceipt: managerPaper?.imageProductReceipt,
      comment: managerPaper?.comment,
      cashCollectionId: managerPaper?.cashCollectionId,
      createdAt: managerPaper.createdAt,
      updatedAt: managerPaper.updatedAt,
      createdById: managerPaper.createdById,
      updatedById: managerPaper.updatedById,
    };
  }
}
