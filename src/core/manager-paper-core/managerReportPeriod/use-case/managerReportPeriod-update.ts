import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { UpdateDto } from '@manager-paper/managerReportPeriod/use-case/dto/update.dto';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class UpdateManagerReportPeriodUseCase {
  constructor(
    private readonly managerReportPeriodRepository: IManagerReportPeriodRepository,
  ) {}

  async execute(
    input: UpdateDto,
    oldManagerReportPeriod: ManagerReportPeriod,
    user: User,
  ): Promise<ManagerReportPeriod> {
    const {
      status,
      startPeriod,
      endPeriod,
      sumStartPeriod,
      sumEndPeriod,
      userId,
    } = input;

    oldManagerReportPeriod.status = status
      ? status
      : oldManagerReportPeriod.status;
    oldManagerReportPeriod.startPeriod = startPeriod
      ? startPeriod
      : oldManagerReportPeriod.startPeriod;
    oldManagerReportPeriod.endPeriod = endPeriod
      ? endPeriod
      : oldManagerReportPeriod.endPeriod;
    oldManagerReportPeriod.sumStartPeriod = sumStartPeriod
      ? sumStartPeriod
      : oldManagerReportPeriod.sumStartPeriod;
    oldManagerReportPeriod.sumEndPeriod = sumEndPeriod
      ? sumEndPeriod
      : oldManagerReportPeriod.sumEndPeriod;
    oldManagerReportPeriod.userId = userId
      ? userId
      : oldManagerReportPeriod.userId;

    oldManagerReportPeriod.updatedAt = new Date(Date.now());
    oldManagerReportPeriod.updatedById = user.id;
    return await this.managerReportPeriodRepository.update(
      oldManagerReportPeriod,
    );
  }
}
