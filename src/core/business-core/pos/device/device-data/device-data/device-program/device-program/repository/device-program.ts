import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  PrismaCarWashDeviceProgramMapper,
  RawDeviceProgramsSummary,
} from '@db/mapper/prisma-car-wash-device-program-mapper';
import { accessibleBy } from '@casl/prisma';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
import { DeviceProgramLastDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-last-data-response.dto';
import { DeviceProgramCleanDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-clean-data-response.dto';

@Injectable()
export class DeviceProgramRepository extends IDeviceProgramRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceProgram): Promise<DeviceProgram> {
    const deviceProgramEntity =
      PrismaCarWashDeviceProgramMapper.toPrisma(input);
    const deviceProgram = await this.prisma.carWashDeviceProgramsEvent.create({
      data: deviceProgramEntity,
    });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findOneById(id: number): Promise<DeviceProgram> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    programCode?: string,
    isPaid?: number,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgramFullDataResponseDto[]> {
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
      where.beginDate = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (organizationId !== undefined) {
      where.carWashDevice = {
        carWasPos: {
          pos: {
            organizationId,
          },
        },
      };
    }

    if (isPaid !== undefined) {
      where.isPaid = isPaid;
    }

    if (programCode !== undefined) {
      where.carWashDeviceProgramsType = {
        code: programCode,
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

    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: finalWhere,
        include: {
          carWashDeviceProgramsType: true,
          carWashDevice: {
            include: {
              carWasPos: {
                select: {
                  pos: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomainWithPos(item),
    );
  }

  public async findDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceProgramsSummary[]
    >`
    SELECT 
      cwp."posId" AS "ownerId",
      cwdpt.name AS "programName",
      COUNT(*) AS "counter",
      SUM(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate")) / 60) AS "totalTime",
      AVG(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate")) / 60) AS "averageTime"
    FROM 
      "CarWashDeviceProgramsEvent" cwdpe
    JOIN 
      "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
    JOIN 
      "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
    WHERE 
        cwp."posId" = ANY(${posIds}::int[])
        AND cwdpe."beginDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
    GROUP BY 
      cwp."posId", cwdpt.name
    ORDER BY 
      cwp."posId", "counter" DESC
  `;

    return monitoringData.map((item) =>
      PrismaCarWashDeviceProgramMapper.toMonitoringRersponseDto(item),
    );
  }

  public async findDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceProgramsSummary[]
    >`
    SELECT 
      cwd.id AS "ownerId",
      cwdpt.name AS "programName",
      COUNT(*) AS "counter",
      SUM(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate")) / 60) AS "totalTime",
      AVG(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate")) / 60) AS "averageTime"
    FROM 
      "CarWashDeviceProgramsEvent" cwdpe
    JOIN 
      "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
    WHERE 
        cwd.id = ANY(${deviceIds}::int[])
        AND cwdpe."beginDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
    GROUP BY 
      cwd.id, cwdpt.name
    ORDER BY 
      cwd.id, "counter" DESC
  `;

    return monitoringData.map((item) =>
      PrismaCarWashDeviceProgramMapper.toMonitoringRersponseDto(item),
    );
  }

  public async findDataByMonitoringDetailPortal(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    const monitoringData = await this.prisma.$queryRaw<
      RawDeviceProgramsSummary[]
    >`
    WITH program_stats AS (
      SELECT
        cwd.id AS device_id,
        cwdpt.name AS program_name,
        COUNT(cwdpe.id) AS counter,
        SUM(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate"))/60) AS total_time,
        AVG(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate"))/60) AS avg_time
      FROM "CarWashDeviceProgramsEvent" cwdpe
      JOIN "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
      JOIN "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
      WHERE cwd.id = ANY(${deviceIds}::int[])
        AND cwdpe."beginDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
      GROUP BY cwd.id, cwdpt.name
    ),
    operation_stats AS (
      SELECT
        cwdpe."carWashDeviceId" AS device_id,
        cwdpt.name AS program_name,
        SUM(cwdoe."operSum") AS total_profit,
        COUNT(cwdoe.id) AS operation_count
      FROM "CarWashDeviceOperationsEvent" cwdoe
      JOIN "CarWashDeviceProgramsEvent" cwdpe ON 
        cwdoe."carWashDeviceId" = cwdpe."carWashDeviceId" AND
        cwdoe."operDate" BETWEEN 
          (cwdpe."beginDate" - INTERVAL '5 minutes') AND 
          cwdpe."beginDate"
      JOIN "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
      WHERE cwdpe."carWashDeviceId" = ANY(${deviceIds}::int[])
        AND cwdpe."beginDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
      GROUP BY cwdpe."carWashDeviceId", cwdpt.name
    )
    SELECT
      ps.device_id AS "ownerId",
      ps.program_name AS "programName",
      ps.counter AS "counter",
      ps.total_time AS "totalTime",
      ps.avg_time AS "averageTime",
      COALESCE(os.total_profit, 0) AS "totalProfit",
      CASE 
        WHEN ps.counter > 0 THEN COALESCE(os.total_profit, 0) / ps.counter 
        ELSE 0 
      END AS "averageProfit"
    FROM program_stats ps
    LEFT JOIN operation_stats os ON 
      ps.device_id = os.device_id AND 
      ps.program_name = os.program_name
    ORDER BY ps.device_id, ps.counter DESC`;

    return monitoringData.map((item) =>
      PrismaCarWashDeviceProgramMapper.toMonitoringRersponseDto(item),
    );
  }

  public async findDataLastProgByPosIds(
    posIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]> {
    return this.prisma.$queryRaw<
      { ownerId: number; programName: string; operDate: Date }[]
    >`
    SELECT 
      cwp."posId" AS "ownerId",
      cwdpt.name AS "programName",
      MAX(cwdpe."beginDate") AS "operDate"
    FROM 
      "CarWashDeviceProgramsEvent" cwdpe
    JOIN 
      "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
    JOIN 
      "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
    WHERE 
      cwp."posId" = ANY(${posIds}::int[])
    GROUP BY 
      cwp."posId", cwdpt.name
    ORDER BY 
      cwp."posId", MAX(cwdpe."beginDate") DESC
  `;
  }

  public async findDataLastProgByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]> {
    return this.prisma.$queryRaw<
      { ownerId: number; programName: string; operDate: Date }[]
    >`
    SELECT
      cwd.id AS "ownerId",
      cwdpt.name AS "programName",
      MAX(cwdpe."beginDate") AS "operDate" 
    FROM 
      "CarWashDeviceProgramsEvent" cwdpe
    JOIN 
      "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
    JOIN 
      "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
    WHERE 
      cwd.id = ANY(${deviceIds}::int[])
    GROUP BY 
      cwd.id, cwdpt.name
    ORDER BY 
      cwd.id, MAX(cwdpe."beginDate") DESC
  `;
  }

  public async findDataByClean(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramCleanDataResponseDto[]> {
    return this.prisma.$queryRaw`
    SELECT 
      cwd.id as "deviceId",
      cwdpt.name as "programName",
      COUNT(*) as "counter",
      SUM(EXTRACT(EPOCH FROM (cwdpe."endDate" - cwdpe."beginDate"))) as "totalTime"
    FROM "CarWashDeviceProgramsEvent" cwdpe
    JOIN "CarWashDevice" cwd ON cwdpe."carWashDeviceId" = cwd.id
    JOIN "CarWashPos" cwp ON cwd."carWashPosId" = cwp.id
    JOIN "CarWashDeviceProgramsType" cwdpt ON cwdpe."carWashDeviceProgramsTypeId" = cwdpt.id
    WHERE cwp."posId" = ANY(${posIds}::int[])
      AND cwdpe."isPaid" = 0
      AND cwdpe."beginDate" BETWEEN ${dateStart}::timestamp AND ${dateEnd}::timestamp
    GROUP BY cwd.id, cwdpt.name
    ORDER BY cwd.id, COUNT(*) DESC
  `;
  }

  public async findProgramForCheckCar(
    carWashDeviceId: number,
    dateStart: Date,
    carWashDeviceProgramsTypeId: number,
  ): Promise<Date> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          carWashDeviceId,
          carWashDeviceProgramsTypeId,
          beginDate: { lt: dateStart },
        },
        orderBy: {
          beginDate: 'desc',
        },
      });
    if (!deviceProgram) {
      return null;
    }
    return deviceProgram.beginDate;
  }

  public async countAllByDeviceIdAndDateProgram(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.carWashDeviceProgramsEvent.count({
      where: {
        carWashDeviceId: deviceId,
        beginDate: { gte: dateStart, lte: dateEnd },
      },
    });
  }
}
