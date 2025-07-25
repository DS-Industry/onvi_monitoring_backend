import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { CreateDto } from '@manager-paper/managerReportPeriod/use-case/dto/create.dto';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { User } from '@platform-user/user/domain/user';
import { ManagerReportPeriodStatus } from '@prisma/client';

@Injectable()
export class CreateManagerReportPeriodUseCase {
  constructor(
    private readonly managerReportPeriodRepository: IManagerReportPeriodRepository,
  ) {}

  async execute(data: CreateDto, user?: User): Promise<ManagerReportPeriod> {
    const managerReportPeriod = new ManagerReportPeriod({
      status: ManagerReportPeriodStatus.SAVE,
      startPeriod: data.startPeriod,
      endPeriod: data.endPeriod,
      sumStartPeriod: data.sumStartPeriod,
      sumEndPeriod: data.sumEndPeriod,
      userId: data.userId,
      createdAt: new Date(Date.now()),
      createdById: user?.id ?? null,
      updatedAt: new Date(Date.now()),
      updatedById: user?.id ?? null,
    });

    return await this.managerReportPeriodRepository.create(managerReportPeriod);
  }
}
