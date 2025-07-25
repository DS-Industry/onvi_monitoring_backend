import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';

export abstract class IManagerPaperTypeRepository {
  abstract create(input: ManagerPaperType): Promise<ManagerPaperType>;
  abstract findOneById(id: number): Promise<ManagerPaperType>;
  abstract findOneByName(name: string): Promise<ManagerPaperType>;
  abstract findAll(): Promise<ManagerPaperType[]>;
  abstract update(input: ManagerPaperType): Promise<ManagerPaperType>;
}
