import { Injectable } from '@nestjs/common';
import { IManagerPaperTypeRepository } from '@manager-paper/managerPaperType/interface/managerPaperType';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';

@Injectable()
export class FindMethodsManagerPaperTypeUseCase {
  constructor(
    private readonly managerPaperTypeRepository: IManagerPaperTypeRepository,
  ) {}

  async getOneById(id: number): Promise<ManagerPaperType> {
    return await this.managerPaperTypeRepository.findOneById(id);
  }

  async getOneByName(name: string): Promise<ManagerPaperType> {
    return await this.managerPaperTypeRepository.findOneByName(name);
  }

  async getAll(): Promise<ManagerPaperType[]> {
    return await this.managerPaperTypeRepository.findAll();
  }
}
