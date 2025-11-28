import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { ManagerReportPeriodStatus } from '@prisma/client';

@Injectable()
export class FindMethodsManagerReportPeriodUseCase {
  constructor(
    private readonly managerReportPeriodRepository: IManagerReportPeriodRepository,
  ) {}

  async getOneById(id: number): Promise<ManagerReportPeriod> {
    return await this.managerReportPeriodRepository.findOneById(id);
  }

  async getAllByFilter(data: {
    status?: ManagerReportPeriodStatus;
    dateStartPeriod?: Date;
    dateEndPeriod?: Date;
    userId?: number;
    skip?: number;
    take?: number;
  }): Promise<ManagerReportPeriod[]> {
    return await this.managerReportPeriodRepository.findAllByFilter(
      data.status,
      data.dateStartPeriod,
      data.dateEndPeriod,
      data.userId,
      data.skip,
      data.take,
    );
  }

  async getCountByFilter(data: {
    status?: ManagerReportPeriodStatus;
    dateStartPeriod?: Date;
    dateEndPeriod?: Date;
    userId?: number;
  }): Promise<number> {
    return await this.managerReportPeriodRepository.countAllByFilter(
      data.status,
      data.dateStartPeriod,
      data.dateEndPeriod,
      data.userId,
    );
  }
}
