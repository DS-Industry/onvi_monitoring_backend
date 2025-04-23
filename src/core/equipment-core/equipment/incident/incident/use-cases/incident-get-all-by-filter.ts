import { Injectable } from '@nestjs/common';
import { IncidentGetAllByFilterResponseDto } from '@equipment/incident/incident/use-cases/dto/incident-get-all-by-filter-response.dto';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { Incident } from '@equipment/incident/incident/domain/incident';
import { FindMethodsIncidentInfoUseCase } from '@equipment/incident/incidentInfo/use-cases/incident-info-find-methods';
import { FindMethodsIncidentNameUseCase } from '@equipment/incident/incidentName/use-cases/incident-name-find-methods';
import { FindMethodsEquipmentKnotUseCase } from '@equipment/equipmentKnot/use-cases/equipment-knot-find-methods';

@Injectable()
export class GetAllByFilterIncidentUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly findMethodsIncidentInfoUseCase: FindMethodsIncidentInfoUseCase,
    private readonly findMethodsIncidentNameUseCase: FindMethodsIncidentNameUseCase,
    private readonly findMethodsEquipmentKnotUseCase: FindMethodsEquipmentKnotUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    posId: number | '*',
  ): Promise<IncidentGetAllByFilterResponseDto[]> {
    const response: IncidentGetAllByFilterResponseDto[] = [];
    let incidents: Incident[] = [];
    if (posId != '*') {
      incidents = await this.incidentRepository.findAllByPosIdAndDate(
        posId,
        dateStart,
        dateEnd,
      );
    } else {
      incidents = await this.incidentRepository.findAllByDate(
        dateStart,
        dateEnd,
      );
    }
    await Promise.all(
      incidents.map(async (incident) => {
        let equipmentKnotName = null;
        if (incident.equipmentKnotId) {
          const equipmentKnot =
            await this.findMethodsEquipmentKnotUseCase.getById(
              incident.equipmentKnotId,
            );
          equipmentKnotName = equipmentKnot.name;
        }

        let incidentNameName = null;
        if (incident.incidentNameId) {
          const incidentName =
            await this.findMethodsIncidentNameUseCase.getById(
              incident.incidentNameId,
            );
          incidentNameName = incidentName.name;
        }

        let incidentReasonName = null;
        if (incident.incidentReasonId) {
          const incidentReason =
            await this.findMethodsIncidentInfoUseCase.getById(
              incident.incidentReasonId,
            );
          incidentReasonName = incidentReason.name;
        }

        let incidentSolutionName = null;
        if (incident.incidentSolutionId) {
          const incidentSolution =
            await this.findMethodsIncidentInfoUseCase.getById(
              incident.incidentSolutionId,
            );
          incidentSolutionName = incidentSolution.name;
        }

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
          equipmentKnot: equipmentKnotName,
          incidentName: incidentNameName,
          incidentReason: incidentReasonName,
          incidentSolution: incidentSolutionName,
          downtime: incident.downtime === 1 ? 'Да' : 'Нет',
          comment: incident.comment,
          programId: incident.carWashDeviceProgramsTypeId,
        });
      }),
    );
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
