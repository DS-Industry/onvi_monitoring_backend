import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { ManagerPaperGroup } from '@prisma/client';
import { ManagerPaperWithTypeDto } from '@manager-paper/managerPaper/use-case/dto/managerPaperWithType.dto';

export abstract class IManagerPaperRepository {
  abstract create(input: ManagerPaper): Promise<ManagerPaper>;
  abstract findOneById(id: number): Promise<ManagerPaper>;
  abstract findAllByFilter(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
    skip?: number,
    take?: number,
  ): Promise<ManagerPaper[]>;
  abstract findAllByFilterWithType(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
    skip?: number,
    take?: number,
  ): Promise<ManagerPaperWithTypeDto[]>;
  abstract countAllByFilter(
    ability?: any,
    group?: ManagerPaperGroup,
    posId?: number,
    paperTypeId?: number,
    userId?: number,
    dateStartEvent?: Date,
    dateEndEvent?: Date,
  ): Promise<number>;
  abstract update(input: ManagerPaper): Promise<ManagerPaper>;
  abstract delete(id: number): Promise<void>;
  abstract deleteByCashCollection(cashCollectionId: number): Promise<void>;
}
