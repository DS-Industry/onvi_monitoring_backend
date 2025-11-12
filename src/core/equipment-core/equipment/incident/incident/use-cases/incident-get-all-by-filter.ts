import { Injectable } from '@nestjs/common';
import { IncidentByFilterResponseDto } from '@equipment/incident/incident/use-cases/dto/incident-by-filter-response.dto';
import { FindMethodsIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-find-methods';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class GetAllByFilterIncidentUseCase {
  constructor(
    private readonly findMethodsIncidentUseCase: FindMethodsIncidentUseCase,
  ) {}

  async execute(
    user: User,
    dateStart: Date,
    dateEnd: Date,
    posId?: number,
  ): Promise<IncidentByFilterResponseDto[]> {
    const response: IncidentByFilterResponseDto[] = [];
    const incidents = await this.findMethodsIncidentUseCase.getAllByFilter({
      userId: user.id,
      posId: posId,
      dateStart: dateStart,
      dateEnd: dateEnd,
    });

    for (const incident of incidents) {
      response.push({
        id: incident.id,
        workerId: incident.workerId,
        posId: incident.posId,
        objectName: incident.objectName,
        appearanceDate: incident.appearanceDate,
        startDate: incident.startDate,
        finishDate: incident.finishDate,
        repair: this.formatSecondsToTime(
          incident.finishDate,
          incident.appearanceDate,
        ),
        equipmentKnot: incident?.equipmentKnot,
        incidentName: incident?.incidentName,
        incidentReason: incident?.incidentReason,
        incidentSolution: incident?.incidentSolution,
        downtime: incident.downtime === 1 ? 'Да' : 'Нет',
        comment: incident.comment,
        programId: incident?.carWashDeviceProgramsTypeId,
      });
    }
    return response;
  }

  private formatSecondsToTime(endDate: Date, beginDate: Date): string {
    const seconds = Math.trunc(
      (endDate.getTime() - beginDate.getTime()) / 1000,
    );

    const days = Math.trunc(seconds / 86400); // 86400 секунд в сутках
    const hours = Math.trunc((seconds % 86400) / 3600); // 3600 секунд в часе
    const minutes = Math.trunc((seconds % 3600) / 60); // 60 секунд в минуте
    const remainingSeconds = Math.trunc(seconds % 60);

    let result = '';

    if (days === 1) {
      result += `${days} день `;
    } else if (days > 1) {
      result += `${days} дней `;
    }

    if (hours === 1) {
      result += `${hours} час `;
    } else if (hours > 1) {
      result += `${hours} часа `;
    }

    if (minutes > 0) {
      result += `${minutes} мин. `;
    }

    if (remainingSeconds > 0) {
      result += `${remainingSeconds} сек.`;
    }

    return result.trim();
  }
}
