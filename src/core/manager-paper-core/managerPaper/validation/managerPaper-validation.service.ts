import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { ManagerReportPeriodStatus } from '@prisma/client';
import { ManagerPaperException } from '@exception/option.exceptions';
import { MANAGER_PAPER_PERIOD_ALREADY_SENT_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class ManagerPaperValidationService {
  constructor(
    private readonly managerReportPeriodRepository: IManagerReportPeriodRepository,
  ) {}

  async validatePeriodNotSent(eventDate: Date, userId: number): Promise<void> {
    const existingPeriod = await this.managerReportPeriodRepository.findByDateAndUser(
      eventDate,
      userId,
    );

    if (existingPeriod && existingPeriod.status === ManagerReportPeriodStatus.SENT) {
      throw new ManagerPaperException(
        MANAGER_PAPER_PERIOD_ALREADY_SENT_EXCEPTION_CODE,
        'The existing period has already been sent',
      );
    }
  }
}
