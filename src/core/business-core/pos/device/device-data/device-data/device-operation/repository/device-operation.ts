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
import { DeviceOperationLastDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-last-data-response.dto';
import { DeviceOperationFullSumDyPosResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-sum-dy-pos-response.dto';
import { DeviceOperationDailyStatisticResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-daily-statistic-response.dto';

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

  public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    currencyId?: number,
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

    if (currencyId !== undefined) {
      where.currency = {
        id: currencyId,
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

  public async findCountByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    currencyId?: number,
  ): Promise<number> {
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

    if (currencyId !== undefined) {
      where.currency = {
        id: currencyId,
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
    return this.prisma.carWashDeviceOperationsEvent.count({
      where: finalWhere,
    });
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
      pl.pos_id AS "ownerId",
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

  public async findDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceOperationsSummary[]
    >`
    WITH device_list AS (
      SELECT unnest(${deviceIds}::int[]) AS device_id
    ),
    operations AS (
      SELECT 
        cwd.id AS device_id,
        COUNT(cwdoe.id) AS counter,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'CASH' THEN cwdoe."operSum" ELSE 0 END), 0) AS cash_sum,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'CASHLESS' THEN cwdoe."operSum" ELSE 0 END), 0) AS cashless_sum,
        COALESCE(SUM(CASE WHEN c."currencyType" = 'VIRTUAL' THEN cwdoe."operSum" ELSE 0 END), 0) AS virtual_sum
      FROM 
        "CarWashDeviceOperationsEvent" cwdoe
      JOIN
        "Currency" c ON cwdoe."currencyId" = c.id
      JOIN 
        "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
      WHERE 
        cwd.id = ANY(${deviceIds}::int[])
        AND cwdoe."operDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
      GROUP BY 
        cwd.id
    )
    SELECT 
      dl.device_id AS "ownerId",
      COALESCE(op.counter, 0) AS "counter",
      COALESCE(op.cash_sum, 0) AS "cashSum",
      COALESCE(op.cashless_sum, 0) AS "cashlessSum",
      COALESCE(op.virtual_sum, 0) AS "virtualSum"
    FROM 
      device_list dl
    LEFT JOIN 
      operations op ON dl.device_id = op.device_id
    ORDER BY 
      dl.device_id
  `;

    return monitoringData.map((item) =>
      PrismaCarWashDeviceOperMapper.toMonitoringResponseDto(item),
    );
  }

  public async findDataLastOperByPosIds(
    posIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]> {
    return this.prisma.$queryRaw<{ ownerId: number; operDate: Date }[]>`
    SELECT 
      cwp."posId" AS "ownerId",
      MAX(cwdoe."operDate") AS "operDate"
    FROM 
      "CarWashDeviceOperationsEvent" cwdoe
    JOIN 
      "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
    WHERE 
      cwp."posId" = ANY(${posIds}::int[])
    GROUP BY 
      cwp."posId"
  `;
  }

  public async findDataLastOperByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]> {
    return this.prisma.$queryRaw<{ ownerId: number; operDate: Date }[]>`
    SELECT 
      cwd.id AS "ownerId",
      MAX(cwdoe."operDate") AS "operDate"
    FROM 
      "CarWashDeviceOperationsEvent" cwdoe
    JOIN 
      "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
    WHERE 
      cwd.id = ANY(${deviceIds}::int[])
    GROUP BY 
      cwd.id
  `;
  }

  public async findAllSumByPos(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationFullSumDyPosResponseDto[]> {
    const result = await this.prisma.$queryRaw<
      DeviceOperationFullSumDyPosResponseDto[]
    >`
    SELECT 
      cwp.name as "posName",
      COALESCE(SUM(cwdoe."operSum"), 0) as "sum"
    FROM 
      "CarWashPos" cwp
    LEFT JOIN 
      "CarWashDevice" cwd ON cwp.id = cwd."carWashPosId"
    LEFT JOIN 
      "CarWashDeviceOperationsEvent" cwdoe ON cwd.id = cwdoe."carWashDeviceId"
      AND cwdoe."operDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
    WHERE 
      cwp."posId" = ANY(${posIds}::int[])
    GROUP BY 
      cwp."posId", cwp.name
    ORDER BY 
      "sum" DESC
  `;

    return result.map((item) => ({
      posName: item.posName,
      sum: Number(item.sum),
    }));
  }

  public async findDailyStatistics(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationDailyStatisticResponseDto[]> {
    const result = await this.prisma.$queryRaw<{ date: Date; sum: number }[]>`
    SELECT 
      DATE_TRUNC('day', cwdoe."operDate") as "date",
      COALESCE(SUM(cwdoe."operSum"), 0) as "sum"
    FROM 
      "CarWashDeviceOperationsEvent" cwdoe
    JOIN 
      "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
    WHERE 
      cwp."posId" = ANY(${posIds}::int[])
      AND cwdoe."operDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
    GROUP BY 
      DATE_TRUNC('day', cwdoe."operDate")
    ORDER BY 
      "date" ASC
  `;

    return result.map((item) => ({
      date: item.date,
      sum: Number(item.sum),
    }));
  }
}
