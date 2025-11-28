import { Injectable } from '@nestjs/common';
import { IIncidentNameRepository } from '@equipment/incident/incidentName/interface/incidentName';
import { PrismaService } from '@db/prisma/prisma.service';
import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';
import { PrismaIncidentNameMapper } from '@db/mapper/prisma-incident-name-mapper';

@Injectable()
export class IncidentNameRepository extends IIncidentNameRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: IncidentName): Promise<IncidentName> {
    const equipmentEntity = PrismaIncidentNameMapper.toPrisma(input);
    const equipment = await this.prisma.incidentName.create({
      data: equipmentEntity,
    });
    return PrismaIncidentNameMapper.toDomain(equipment);
  }

  public async findOneById(id: number): Promise<IncidentName> {
    const equipment = await this.prisma.incidentName.findFirst({
      where: {
        id,
      },
    });
    return PrismaIncidentNameMapper.toDomain(equipment);
  }

  public async findAllByEquipmentKnotId(id: number): Promise<IncidentName[]> {
    const equipments = await this.prisma.incidentName.findMany({
      where: {
        equipmentKnots: {
          some: {
            id,
          },
        },
      },
    });
    return equipments.map((item) => PrismaIncidentNameMapper.toDomain(item));
  }

  public async update(input: IncidentName): Promise<IncidentName> {
    const equipmentEntity = PrismaIncidentNameMapper.toPrisma(input);
    const equipment = await this.prisma.incidentName.update({
      where: {
        id: input.id,
      },
      data: equipmentEntity,
    });
    return PrismaIncidentNameMapper.toDomain(equipment);
  }
}
