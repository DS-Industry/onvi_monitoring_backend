import { Injectable } from '@nestjs/common';
import { IEquipmentKnotRepository } from '@equipment/equipmentKnot/interface/equipmentKnot';
import { PrismaService } from '@db/prisma/prisma.service';
import { EquipmentKnot } from '@equipment/equipmentKnot/domain/equipmentKnot';
import { PrismaEquipmentKnotMapper } from '@db/mapper/prisma-equipment-knot-mapper';
import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';
import { Prisma } from "@prisma/client";

@Injectable()
export class EquipmentKnotRepository extends IEquipmentKnotRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: EquipmentKnot): Promise<EquipmentKnot> {
    const equipmentKnotEntity = PrismaEquipmentKnotMapper.toPrisma(input);
    const equipmentKnot = await this.prisma.equipmentKnot.create({
      data: equipmentKnotEntity,
    });
    return PrismaEquipmentKnotMapper.toDomain(equipmentKnot);
  }

  public async findOneById(id: number): Promise<EquipmentKnot> {
    const equipmentKnot = await this.prisma.equipmentKnot.findFirst({
      where: {
        id,
      },
    });
    return PrismaEquipmentKnotMapper.toDomain(equipmentKnot);
  }

  public async findAllByPosId(posId: number): Promise<EquipmentKnot[]> {
    const equipmentKnots = await this.prisma.equipmentKnot.findMany({
      where: {
        posId,
      },
    });
    return equipmentKnots.map((item) =>
      PrismaEquipmentKnotMapper.toDomain(item),
    );
  }

  public async update(
    input: EquipmentKnot,
    incidentName?: IncidentName,
  ): Promise<EquipmentKnot> {
    const equipmentKnotEntity = PrismaEquipmentKnotMapper.toPrisma(input);
    const updateData: Prisma.EquipmentKnotUpdateArgs = {
      where: {
        id: input.id,
      },
      data: equipmentKnotEntity,
    };

    if (incidentName) {
      updateData.data.incidentName = {
        connect: {
          id: incidentName.id,
        },
      };
    }

    const equipmentKnots = await this.prisma.equipmentKnot.update(updateData);
    return PrismaEquipmentKnotMapper.toDomain(equipmentKnots);
  }
}
