import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import {
  PrismaCarWashDeviceOperMapper,
  RawDeviceOperationsSummary,
} from '@db/mapper/prisma-car-wash-device-oper-mapper';
import { CurrencyType } from '@prisma/client';
import { accessibleBy } from '@casl/prisma';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';

@Injectable()
export class DeviceOperationRepository extends IDeviceOperationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceOperation): Promise<DeviceOperation> {
    const deviceOperationEntity = PrismaCarWashDeviceOperMapper.toPrisma(input);
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.create({
        data: deviceOperationEntity,
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async findOneById(id: number): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }
  /*public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posId?: number,
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationFullDataResponseDto[]> {
    const whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (ability) {
      whereConditions.push(`p.id IN (66, 295)`);
    }

    if (organizationId !== undefined) {
      whereConditions.push(`p."organizationId" = $${paramIndex++}`);
      params.push(organizationId);
    }

    if (posId !== undefined) {
      whereConditions.push(`p.id = $${paramIndex++}`);
      params.push(posId);
    }

    if (carWashDeviceId !== undefined) {
      whereConditions.push(`cwdoe."carWashDeviceId" = $${paramIndex++}`);
      params.push(carWashDeviceId);
    }

    if (dateStart !== undefined && dateEnd !== undefined) {
      whereConditions.push(
        `cwdoe."operDate" >= $${paramIndex++} AND cwdoe."operDate" <= $${paramIndex++}`,
      );
      params.push(dateStart, dateEnd);
    }

    if (currencyType !== undefined) {
      whereConditions.push(`c."currencyType" = $${paramIndex++}`);
      params.push(currencyType);
    }

    // Собираем полный WHERE
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    // Строим запрос
    const query = `
    SELECT 
      cwdoe.id,
      cwdoe."carWashDeviceId" as "carWashDeviceId",
      cwdoe."operDate" as "operDate",
      cwdoe."loadDate" as "loadDate",
      cwdoe.counter,
      cwdoe."operSum" as "operSum",
      cwdoe.confirm,
      cwdoe."isAgregate" as "isAgregate",
      cwdoe."localId" as "localId",
      cwdoe."currencyId" as "currencyId",
      cwdoe."isBoxOffice" as "isBoxOffice",
      cwdoe."errNumId" as "errNumId",
      c."currencyType" as "currencyType",
      c.name as "currencyName",
      c."currencyView" as "currencyView",
      p.id as "posId",
      p.name as "posName"
    FROM 
      "CarWashDeviceOperationsEvent" cwdoe
      JOIN "Currency" c ON cwdoe."currencyId" = c.id
      JOIN "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
      JOIN "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
      JOIN "Pos" p ON cwp."posId" = p.id
    ${whereClause}
    ORDER BY cwdoe."operDate" ASC
    ${skip !== undefined ? `OFFSET $${paramIndex++}` : ''}
    ${take !== undefined ? `LIMIT $${paramIndex++}` : ''}
  `;

    const results = await this.prisma.$queryRawUnsafe<
      DeviceOperationFullDataResponseDto[]
    >(query, ...params);

    return results;
  }*/

  public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationFullDataResponseDto[]> {
    const where: any = {};

    if (organizationId !== undefined) {
      where.carWashDevice = {
        carWasPos: {
          pos: {
            organizationId,
          },
        },
      };
    }

    if (posIds !== undefined && posIds.length > 0) {
      where.carWashDevice = {
        carWasPos: {
          posId: {
            in: posIds,
          },
        },
      };
    }

    if (carWashDeviceId !== undefined) {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (dateStart !== undefined && dateEnd !== undefined) {
      where.operDate = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (currencyType !== undefined) {
      where.currency = {
        currencyType,
      };
    }

    const finalWhere = ability
      ? {
          AND: [
            {
              carWashDevice: {
                carWasPos: {
                  pos: accessibleBy(ability).Pos,
                },
              },
            },
            where,
          ],
        }
      : where;
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: finalWhere,
        orderBy: {
          operDate: 'asc',
        },
        include: {
          currency: {
            select: {
              currencyType: true,
              currencyView: true,
              name: true,
            },
          },
          carWashDevice: {
            select: {
              carWasPos: {
                select: {
                  pos: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomainWithPosData(item),
    );
  }

  public async findDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceOperationsSummary[]
    >`
    WITH pos_list AS (
      SELECT unnest(${posIds}::int[]) AS pos_id
    ),
    operations AS (
      SELECT 
        cwp."posId" AS pos_id,
        COUNT(cwdoe.id) AS counter,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'CASH' THEN cwdoe."operSum" ELSE 0 END), 0) AS cash_sum,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'CASHLESS' THEN cwdoe."operSum" ELSE 0 END), 0) AS cashless_sum,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'VIRTUAL' THEN cwdoe."operSum" ELSE 0 END), 0) AS virtual_sum
      FROM 
        "CarWashDeviceOperationsEvent" cwdoe
      JOIN 
        "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
      JOIN 
        "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
      JOIN
        "Currency" c ON cwdoe."currencyId" = c.id
      WHERE 
        cwp."posId" = ANY(${posIds}::int[])
        AND cwdoe."operDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
      GROUP BY 
        cwp."posId"
    )
    SELECT 
      pl.pos_id AS "posId",
      COALESCE(op.counter, 0) AS "counter",
      COALESCE(op.cash_sum, 0) AS "cashSum",
      COALESCE(op.cashless_sum, 0) AS "cashlessSum",
      COALESCE(op.virtual_sum, 0) AS "virtualSum"
    FROM 
      pos_list pl
    LEFT JOIN 
      operations op ON pl.pos_id = op.pos_id
    ORDER BY 
      pl.pos_id
  `;

    return monitoringData.map((item) =>
      PrismaCarWashDeviceOperMapper.toMonitoringResponseDto(item),
    );
  }

  public async findLastOperByPosId(
    carWashPosId: number,
  ): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          carWashDevice: {
            carWashPosId,
          },
        },
        orderBy: {
          operDate: 'desc',
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async findLastOperByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          carWashDeviceId,
        },
        orderBy: {
          operDate: 'desc',
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async countAllByDeviceIdAndDateOper(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.carWashDeviceOperationsEvent.count({
      where: {
        carWashDeviceId: deviceId,
        operDate: { gte: dateStart, lte: dateEnd },
      },
    });
  }
}
