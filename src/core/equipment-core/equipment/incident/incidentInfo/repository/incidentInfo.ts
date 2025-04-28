import { Injectable } from '@nestjs/common';
import { IIncidentInfoRepository } from '@equipment/incident/incidentInfo/interface/incidentInfo';
import { PrismaService } from '@db/prisma/prisma.service';
import { IncidentInfo } from '@equipment/incident/incidentInfo/domain/incidentInfo';
import { PrismaIncidentInfoMapper } from '@db/mapper/prisma-incident-info-mapper';

@Injectable()
export class IncidentInfoRepository extends IIncidentInfoRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: IncidentInfo): Promise<IncidentInfo> {
    const incidentInfoEntity = PrismaIncidentInfoMapper.toPrisma(input);
    const incidentInfo = await this.prisma.incidentInfo.create({
      data: incidentInfoEntity,
    });
    return PrismaIncidentInfoMapper.toDomain(incidentInfo);
  }

  public async findOneById(id: number): Promise<IncidentInfo> {
    const incidentInfo = await this.prisma.incidentInfo.findFirst({
      where: {
        id,
      },
    });
    return PrismaIncidentInfoMapper.toDomain(incidentInfo);
  }

  public async findAllByIncidentNameId(id: number): Promise<IncidentInfo[]> {
    const incidentInfos = await this.prisma.incidentInfo.findMany({
      where: {
        incidentName: {
          some: {
            id,
          },
        },
      },
    });
    return incidentInfos.map((item) => PrismaIncidentInfoMapper.toDomain(item));
  }
}
