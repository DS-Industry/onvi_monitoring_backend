import { Injectable } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { PrismaService } from '@db/prisma/prisma.service';
import { Incident } from '@equipment/incident/incident/domain/incident';
import { PrismaIncidentMapper } from '@db/mapper/prisma-incident-mapper';

@Injectable()
export class IncidentRepository extends IIncidentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Incident): Promise<Incident> {
    const incidentEntity = PrismaIncidentMapper.toPrisma(input);
    console.log(incidentEntity);
    const incident = await this.prisma.incident.create({
      data: {
        ...incidentEntity,
      },
    });
    return PrismaIncidentMapper.toDomain(incident);
  }

  public async findOneById(id: number): Promise<Incident> {
    const incident = await this.prisma.incident.findFirst({
      where: {
        id,
      },
    });
    return PrismaIncidentMapper.toDomain(incident);
  }

  public async findAllByPosId(id: number): Promise<Incident[]> {
    const incidents = await this.prisma.incident.findMany({
      where: {
        posId: id,
      },
    });
    return incidents.map((item) => PrismaIncidentMapper.toDomain(item));
  }

  public async findAllByPosIdAndDate(
    id: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Incident[]> {
    const incident = await this.prisma.incident.findMany({
      where: {
        posId: id,
        appearanceDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        appearanceDate: 'desc',
      },
    });
    return incident.map((item) => PrismaIncidentMapper.toDomain(item));
  }

  public async findAllByDate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Incident[]> {
    const incident = await this.prisma.incident.findMany({
      where: {
        appearanceDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        appearanceDate: 'desc',
      },
    });
    return incident.map((item) => PrismaIncidentMapper.toDomain(item));
  }

  public async update(input: Incident): Promise<Incident> {
    const incidentEntity = PrismaIncidentMapper.toPrisma(input);
    const incident = await this.prisma.incident.update({
      where: {
        id: input.id,
      },
      data: incidentEntity,
    });
    return PrismaIncidentMapper.toDomain(incident);
  }
}
