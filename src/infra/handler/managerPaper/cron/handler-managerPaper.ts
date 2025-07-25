import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HandlerManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-handler';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { MANAGER_REPORT_PERIOD_ROLE_IDS } from '@constant/constants';
import { StatusUser } from '@prisma/client';

@Injectable()
export class HandlerManagerPaperCron {
  constructor(
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly handlerManagerReportPeriodUseCase: HandlerManagerReportPeriodUseCase,
  ) {}

  @Cron('0 0 2 * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    const userManagers = await this.findMethodsUserUseCase.getAllByRoleIds(
      MANAGER_REPORT_PERIOD_ROLE_IDS,
    );
    const activeManagerIds = userManagers
      .filter((user) => user.status === StatusUser.ACTIVE)
      .map((user) => user.id);
    await this.handlerManagerReportPeriodUseCase.execute(activeManagerIds);
  }
}
