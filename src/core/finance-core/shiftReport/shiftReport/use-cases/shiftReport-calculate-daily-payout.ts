import { Injectable } from '@nestjs/common';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { PrismaService } from '@db/prisma/prisma.service';
import { IPosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/interface/posPositionSalaryRate';
import { DateTime, FixedOffsetZone } from 'luxon';

@Injectable()
export class CalculateDailyPayoutShiftReportUseCase {
  constructor(
    private readonly findMethodsWorkerUseCase: FindMethodsWorkerUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly prisma: PrismaService,
    private readonly posPositionSalaryRateRepository: IPosPositionSalaryRateRepository,
  ) {}

  private isNightShift(
    startWorkingTime?: Date,
    timezoneOffset?: number,
  ): boolean {
    if (!startWorkingTime) {
      return false;
    }

    let localTime: DateTime;
    if (timezoneOffset !== undefined && timezoneOffset !== null) {
      const offsetMinutes = timezoneOffset * 60;
      const timezone = FixedOffsetZone.instance(offsetMinutes);
      localTime = DateTime.fromJSDate(startWorkingTime, { zone: 'utc' })
        .setZone(timezone);
    } else {
      localTime = DateTime.fromJSDate(startWorkingTime, { zone: 'utc' })
        .setZone(process.env.TZ || 'utc');
    }

    const startHour = localTime.hour;

    return startHour < 8 || startHour >= 20;
  }

  async execute(shiftReportId: number, workerId: number): Promise<number> {
    const shiftReport =
      await this.findMethodsShiftReportUseCase.getOneById(shiftReportId);
    if (!shiftReport) {
      throw new Error(`Shift report with id ${shiftReportId} not found`);
    }

    const worker = await this.findMethodsWorkerUseCase.getById(workerId);
    if (!worker) {
      throw new Error(`Worker with id ${workerId} not found`);
    }

    let posTimezone: number | undefined;
    if (shiftReport.posId) {
      try {
        const pos = await this.prisma.pos.findUnique({
          where: { id: shiftReport.posId },
          select: { timezone: true },
        });
        posTimezone = pos?.timezone;
      } catch (error) {
        console.warn('Could not fetch POS timezone, using default:', error);
      }
    }

    const isNight = this.isNightShift(
      shiftReport.startWorkingTime,
      posTimezone,
    );


    const shiftGradings = await this.prisma.mNGShiftGrading.findMany({
      where: {
        shiftReportId,
      },
      include: {
        gradingParameter: true,
        gradingEstimation: true,
      },
    });

    const totalPercentage = shiftGradings.reduce((sum, grading) => {
      const parameterWeightPercent =
        grading.gradingParameter?.weightPercent || 0;
      const estimationWeightPercent =
        grading.gradingEstimation?.weightPercent || 0;
      const parameterPercent =
        (parameterWeightPercent * estimationWeightPercent) / 100;
      return sum + parameterPercent;
    }, 0);


    let baseRate: number | null = null;
    let bonusRate: number | null = null;

    if (shiftReport.posId && worker.hrPositionId) {
      const positionSalaryRate =
        await this.posPositionSalaryRateRepository.findOneByPosIdAndHrPositionId(
          shiftReport.posId,
          worker.hrPositionId,
        );

      if (positionSalaryRate) {
        const posBaseRate = isNight
          ? positionSalaryRate.baseRateNight
          : positionSalaryRate.baseRateDay;
        const posBonusRate = isNight
          ? positionSalaryRate.bonusRateNight
          : positionSalaryRate.bonusRateDay;

        if (posBaseRate !== null && posBaseRate !== undefined) {
          baseRate = posBaseRate;
        }
        if (posBonusRate !== null && posBonusRate !== undefined) {
          bonusRate = posBonusRate;
        }
      }
    }

    const finalBaseRate = baseRate ?? worker.dailySalary;
    const finalBonusRate = bonusRate ?? worker.bonusPayout ?? 0;

    const dailyShiftPayout =
      finalBaseRate + (finalBonusRate * totalPercentage) / 100;

    return Math.round(dailyShiftPayout);
  }
}
