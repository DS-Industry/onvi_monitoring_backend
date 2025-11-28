import { Injectable } from '@nestjs/common';
import { IManagerPaperRepository } from '@manager-paper/managerPaper/interface/managerPaper';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { ManagerPaperGroup } from '@prisma/client';
import { ManagerPaperWithTypeDto } from '@manager-paper/managerPaper/use-case/dto/managerPaperWithType.dto';

@Injectable()
export class FindMethodsManagerPaperUseCase {
  constructor(
    private readonly managerPaperRepository: IManagerPaperRepository,
  ) {}

  async getOneById(id: number): Promise<ManagerPaper> {
    return await this.managerPaperRepository.findOneById(id);
  }

  async getAllByFilter(data: {
    ability?: any;
    group?: ManagerPaperGroup;
    posId?: number;
    paperTypeId?: number;
    userId?: number;
    dateStartEvent?: Date;
    dateEndEvent?: Date;
    skip?: number;
    take?: number;
  }): Promise<ManagerPaper[]> {
    return await this.managerPaperRepository.findAllByFilter(
      data.ability,
      data.group,
      data.posId,
      data.paperTypeId,
      data.userId,
      data.dateStartEvent,
      data.dateEndEvent,
      data.skip,
      data.take,
    );
  }

  async getAllByFilterWithType(data: {
    ability?: any;
    group?: ManagerPaperGroup;
    posId?: number;
    paperTypeId?: number;
    userId?: number;
    dateStartEvent?: Date;
    dateEndEvent?: Date;
    skip?: number;
    take?: number;
  }): Promise<ManagerPaperWithTypeDto[]> {
    return await this.managerPaperRepository.findAllByFilterWithType(
      data.ability,
      data.group,
      data.posId,
      data.paperTypeId,
      data.userId,
      data.dateStartEvent,
      data.dateEndEvent,
      data.skip,
      data.take,
    );
  }

  async getCountAllByFilter(data: {
    ability?: any;
    group?: ManagerPaperGroup;
    posId?: number;
    paperTypeId?: number;
    userId?: number;
    dateStartEvent?: Date;
    dateEndEvent?: Date;
  }): Promise<number> {
    return await this.managerPaperRepository.countAllByFilter(
      data.ability,
      data.group,
      data.posId,
      data.paperTypeId,
      data.userId,
      data.dateStartEvent,
      data.dateEndEvent,
    );
  }
}
