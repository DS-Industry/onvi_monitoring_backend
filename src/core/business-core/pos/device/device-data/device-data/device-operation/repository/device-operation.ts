import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import {
  PrismaCarWashDeviceOperMapper,
  RawDeviceOperationsSummary,
} from '@db/mapper/prisma-car-wash-device-oper-mapper';
import { CurrencyType, Prisma } from '@prisma/client';
import { accessibleBy } from '@casl/prisma';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';
import { DeviceOperationLastDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-last-data-response.dto';
import { DeviceOperationFullSumDyPosResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-sum-dy-pos-response.dto';
import { DeviceOperationDailyStatisticResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-daily-statistic-response.dto';
import { FalseOperationResponseDto } from '@platform-user/core-controller/dto/response/false-operation-response.dto';
import { FalseOperationDeviceDto } from '@platform-user/core-controller/dto/response/false-operation-device-response.dto';

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
    const toPostgresTimestamp = (date: Date): string => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const dateStartStr = toPostgresTimestamp(dateStart);
    const dateEndStr = toPostgresTimestamp(dateEnd);

    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceOperationsSummary[]
    >(
      Prisma.sql`
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
          cwp."posId" = ANY(${posIds})
          AND cwdoe."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
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
    `,
    );

    return monitoringData.map((item) =>
      PrismaCarWashDeviceOperMapper.toMonitoringResponseDto(item),
    );
  }

  public async findDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    const formatLocalTimestamp = (date: Date): string => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const dateStartStr = formatLocalTimestamp(dateStart);
    const dateEndStr = formatLocalTimestamp(dateEnd);

    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceOperationsSummary[]
    >(
      Prisma.sql`
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
          cwd.id = ANY(${deviceIds})
          AND cwdoe."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
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
    `,
    );

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
    const toPostgresTimestamp = (date: Date): string => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const dateStartStr = toPostgresTimestamp(dateStart);
    const dateEndStr = toPostgresTimestamp(dateEnd);

    const result = await this.prisma.$queryRaw<
      { posName: string; sum: number }[]
    >(
      Prisma.sql`
      SELECT 
        cwp.name AS "posName",
        COALESCE(SUM(cwdoe."operSum"), 0) AS "sum"
      FROM 
        "CarWashPos" cwp
      LEFT JOIN 
        "CarWashDevice" cwd ON cwp.id = cwd."carWashPosId"
      LEFT JOIN 
        "CarWashDeviceOperationsEvent" cwdoe 
          ON cwd.id = cwdoe."carWashDeviceId"
          AND cwdoe."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
      WHERE 
        cwp."posId" = ANY(${posIds})
      GROUP BY 
        cwp."posId", cwp.name
      ORDER BY 
        "sum" DESC
    `,
    );

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
    const toPostgresTimestamp = (date: Date): string => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const dateStartStr = toPostgresTimestamp(dateStart);
    const dateEndStr = toPostgresTimestamp(dateEnd);

    const result = await this.prisma.$queryRaw<{ date: Date; sum: number }[]>(
      Prisma.sql`
      SELECT 
        DATE_TRUNC('day', cwdoe."operDate") AS "date",
        COALESCE(SUM(cwdoe."operSum"), 0) AS "sum"
      FROM 
        "CarWashDeviceOperationsEvent" cwdoe
      JOIN 
        "CarWashDevice" cwd ON cwdoe."carWashDeviceId" = cwd.id
      JOIN 
        "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
      WHERE 
        cwp."posId" = ANY(${posIds})
        AND cwdoe."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
      GROUP BY 
        DATE_TRUNC('day', cwdoe."operDate")
      ORDER BY 
        "date" ASC
    `,
    );

    return result.map((item) => ({
      date: item.date,
      sum: Number(item.sum),
    }));
  }

  public async findFalseOperationsByPosId(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<FalseOperationResponseDto[]> {
    const toPostgresTimestamp = (date: Date): string =>
      date.toISOString().slice(0, 19).replace('T', ' ');

    const dateStartStr = toPostgresTimestamp(dateStart);
    const dateEndStr = toPostgresTimestamp(dateEnd);

    return this.prisma.$queryRaw<
      {
        deviceId: number;
        deviceName: string;
        operDay: string;
        falseOperCount: number;
      }[]
    >(Prisma.sql`
    WITH ops AS (
        SELECT
            e.id,
            e."carWashDeviceId" AS device_id,
            d.name AS device_name,
            c."currencyView",
            e."operDate",
            DATE_TRUNC('day', e."operDate") AS oper_day
        FROM "CarWashDeviceOperationsEvent" e
        JOIN "CarWashDevice" d ON e."carWashDeviceId" = d.id
        JOIN "CarWashPos" p ON d."carWashPosId" = p.id
        JOIN "Currency" c ON e."currencyId" = c.id
        WHERE p."posId" = ${posId}
          AND e."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
          AND c."currencyView" IN ('COIN', 'PAPER', 'POS')
    ),
    grouped_sec AS (
        SELECT
            device_id,
            "currencyView",
            TO_CHAR("operDate", 'YYYY-MM-DD HH24:MI:SS') AS oper_second,
            COUNT(*) AS ops_count
        FROM ops
        WHERE "currencyView" IN ('COIN', 'PAPER')
        GROUP BY device_id, "currencyView", TO_CHAR("operDate", 'YYYY-MM-DD HH24:MI:SS')
    ),
    violating_seconds AS (
        SELECT device_id, "currencyView", oper_second
        FROM grouped_sec
        WHERE ("currencyView" = 'COIN' AND ops_count > 2)
           OR ("currencyView" = 'PAPER' AND ops_count > 1)
    ),
    false_sec_ops AS (
        SELECT o.id, o.device_id, o.device_name, o.oper_day
        FROM ops o
        JOIN violating_seconds v
          ON v.device_id = o.device_id
         AND v."currencyView" = o."currencyView"
         AND v.oper_second = TO_CHAR(o."operDate", 'YYYY-MM-DD HH24:MI:SS')
    ),
    false_pos_ops AS (
        SELECT a.id, a.device_id, a.device_name, a.oper_day
        FROM ops a
        WHERE a."currencyView" = 'POS'
          AND EXISTS (
            SELECT 1
            FROM ops b
            WHERE b."currencyView" = 'POS'
              AND b.device_id = a.device_id
              AND b.id <> a.id
              AND ABS(EXTRACT(EPOCH FROM (b."operDate" - a."operDate"))) <= 5
          )
    ),
    all_false_ops AS (
        SELECT * FROM false_sec_ops
        UNION ALL
        SELECT * FROM false_pos_ops
    )
    SELECT
        device_id AS "deviceId",
        device_name AS "deviceName",
        TO_CHAR(oper_day, 'YYYY-MM-DD') AS "operDay",
        CAST(COUNT(*) AS INTEGER) AS "falseOperCount"
    FROM all_false_ops
    GROUP BY device_id, device_name, oper_day
    ORDER BY device_id, oper_day;
  `);
  }

  public async findFalseOperationsByDeviceId(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<FalseOperationDeviceDto[]> {
    const toPostgresTimestamp = (date: Date): string =>
      date.toISOString().slice(0, 19).replace('T', ' ');

    const dateStartStr = toPostgresTimestamp(dateStart);
    const dateEndStr = toPostgresTimestamp(dateEnd);

    const skipSql =
      skip !== undefined ? Prisma.sql`OFFSET ${skip}` : Prisma.empty;
    const takeSql =
      take !== undefined ? Prisma.sql`LIMIT ${take}` : Prisma.empty;

    return this.prisma.$queryRaw<FalseOperationDeviceDto[]>(Prisma.sql`
    WITH ops AS (
        SELECT
            e.id,
            e."carWashDeviceId" AS device_id,
            d.name AS device_name,
            c."currencyView",
            e."operSum",
            e."operDate",
            TO_CHAR(e."operDate", 'YYYY-MM-DD HH24:MI:SS') AS oper_second
        FROM "CarWashDeviceOperationsEvent" e
        JOIN "CarWashDevice" d ON e."carWashDeviceId" = d.id
        JOIN "Currency" c ON e."currencyId" = c.id
        WHERE e."carWashDeviceId" = ${carWashDeviceId}
          AND e."operDate" BETWEEN ${dateStartStr}::timestamp AND ${dateEndStr}::timestamp
          AND c."currencyView" IN ('COIN', 'PAPER', 'POS')
    ),
    -- группируем по секундам для монет и купюр
    grouped_sec AS (
        SELECT
            device_id,
            "currencyView",
            oper_second,
            COUNT(*) AS ops_count
        FROM ops
        WHERE "currencyView" IN ('COIN', 'PAPER')
        GROUP BY device_id, "currencyView", oper_second
    ),
    -- секунды, где превышен лимит по монетам и купюрам
    violating_sec AS (
        SELECT device_id, "currencyView", oper_second
        FROM grouped_sec
        WHERE ("currencyView" = 'COIN' AND ops_count > 2)
           OR ("currencyView" = 'PAPER' AND ops_count > 1)
    ),
    -- операции по безналу, которые ложные
    violating_pos AS (
        SELECT a.id
        FROM ops a
        WHERE a."currencyView" = 'POS'
          AND EXISTS (
              SELECT 1 FROM ops b
              WHERE b."currencyView" = 'POS'
                AND b.device_id = a.device_id
                AND b.id <> a.id
                AND ABS(EXTRACT(EPOCH FROM (b."operDate" - a."operDate"))) <= 5
          )
    ),
    -- помечаем все ложные операции
    flagged AS (
        SELECT o.id, true AS "falseCheck"
        FROM ops o
        JOIN violating_sec v
          ON v.device_id = o.device_id
         AND v."currencyView" = o."currencyView"
         AND v.oper_second = o.oper_second
        UNION ALL
        SELECT id, true FROM violating_pos
    )
    SELECT 
        o.id,
        o.device_id AS "carWashDeviceId",
        o.device_name AS "deviceName",
        o."operSum",
        o."operDate",
        o."currencyView",
        COALESCE(f."falseCheck", false) AS "falseCheck"
    FROM ops o
    LEFT JOIN flagged f ON f.id = o.id
    ORDER BY o."operDate" ASC
    ${takeSql} ${skipSql};
  `);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.carWashDeviceOperationsEvent.delete({ where: { id } });
  }
}
