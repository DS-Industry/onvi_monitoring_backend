import { Injectable } from '@nestjs/common';
import { FindMethodsIncidentNameUseCase } from '@equipment/incident/incidentName/use-cases/incident-name-find-methods';
import {
  IncidentFullInfoResponseDto,
  IncidentInfoDto,
} from '@equipment/incident/incidentName/use-cases/dto/incident-full-info-response.dto';
import { FindMethodsIncidentInfoUseCase } from '@equipment/incident/incidentInfo/use-cases/incident-info-find-methods';
import { IncidentInfoType } from '@prisma/client';
import { IncidentInfo } from '@equipment/incident/incidentInfo/domain/incidentInfo';

@Injectable()
export class FullInfoByEquipmentKnotIncidentUseCase {
  constructor(
    private readonly findMethodsIncidentNameUseCase: FindMethodsIncidentNameUseCase,
    private readonly findMethodsIncidentInfoUseCase: FindMethodsIncidentInfoUseCase,
  ) {}
  async execute(
    equipmentKnotId: number,
  ): Promise<IncidentFullInfoResponseDto[]> {
    const incidentNames =
      await this.findMethodsIncidentNameUseCase.getAllByEquipmentKnotId(
        equipmentKnotId,
      );
    const response: IncidentFullInfoResponseDto[] = [];

    for (const incidentName of incidentNames) {
      const incidentInfos =
        await this.findMethodsIncidentInfoUseCase.getAllByIncidentNameId(
          incidentName.id,
        );

      const { reasons, solutions } = this.classifyIncidentInfo(incidentInfos);

      response.push({
        id: incidentName.id,
        problemName: incidentName.name,
        reason: reasons,
        solution: solutions,
      });
    }

    return response;
  }

  private classifyIncidentInfo(infos: IncidentInfo[]): {
    reasons: IncidentInfoDto[];
    solutions: IncidentInfoDto[];
  } {
    const reasons: IncidentInfoDto[] = [];
    const solutions: IncidentInfoDto[] = [];

    for (const info of infos) {
      if (info.type === IncidentInfoType.Reason) {
        reasons.push({ id: info.id, infoName: info.name });
      } else if (info.type === IncidentInfoType.Solution) {
        solutions.push({ id: info.id, infoName: info.name });
      }
    }

    return { reasons, solutions };
  }
}
