import { Injectable } from '@nestjs/common';
import { FindMethodsIncidentNameUseCase } from '@equipment/incident/incidentName/use-cases/incident-name-find-methods';
import {
  IncidentFullInfoResponseDto,
  IncidentInfoDto
} from '@equipment/incident/incidentName/use-cases/dto/incident-full-info-response.dto';
import { FindMethodsIncidentInfoUseCase } from '@equipment/incident/incidentInfo/use-cases/incident-info-find-methods';
import { IncidentInfoType } from '@prisma/client';

@Injectable()
export class FullInfoByEquipmentKnotIncidentUseCase {
  constructor(
    private readonly findMethodsIncidentNameUseCase: FindMethodsIncidentNameUseCase,
    private readonly findMethodsIncidentInfoUseCase: FindMethodsIncidentInfoUseCase,
  ) {}
  async execute(
    equipmentKnotId: number,
  ): Promise<IncidentFullInfoResponseDto[]> {
    const response: IncidentFullInfoResponseDto[] = [];
    const incidentNames =
      await this.findMethodsIncidentNameUseCase.getAllByEquipmentKnotId(
        equipmentKnotId,
      );
    await Promise.all(
      incidentNames.map(async (incidentName) => {
        const reason: IncidentInfoDto[] = [];
        const solution: IncidentInfoDto[] = [];
        const incidentInfos =
          await this.findMethodsIncidentInfoUseCase.getAllByIncidentNameId(
            incidentName.id,
          );
        incidentInfos.map((incidentInfo) => {
          if (incidentInfo.type == IncidentInfoType.Reason) {
            reason.push({ id: incidentInfo.id, infoName: incidentInfo.name });
          } else if (incidentInfo.type == IncidentInfoType.Solution) {
            solution.push({ id: incidentInfo.id, infoName: incidentInfo.name });
          }
        });
        response.push({
          id: incidentName.id,
          problemName: incidentName.name,
          reason: reason,
          solution: solution,
        });
      }),
    );
    return response;
  }
}
