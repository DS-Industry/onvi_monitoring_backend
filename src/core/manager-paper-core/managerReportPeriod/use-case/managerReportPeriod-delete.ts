import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';

@Injectable()
export class DeleteManagerReportPeriodUseCase {
  constructor(
    private readonly managerReportPeriodRepository: IManagerReportPeriodRepository,
  ) {}

  async execute(input: ManagerReportPeriod): Promise<any> {
    await this.managerReportPeriodRepository.delete(input.id);
  }
}
