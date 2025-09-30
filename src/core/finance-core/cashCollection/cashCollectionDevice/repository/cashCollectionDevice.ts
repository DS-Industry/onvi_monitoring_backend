import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { PrismaService } from '@db/prisma/prisma.service';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import {
  PrismaCashCollectionDeviceMapper,
  RawDeviceOperationsSummary,
} from '@db/mapper/prisma-cash-collection-device-mapper';
import { CashCollectionDeviceCalculateResponseDto } from '@finance/cashCollection/cashCollectionDevice/use-cases/dto/cashCollectionDevice-calculate-response.dto';
import {
  EVENT_TYPE_CASH_COLLECTION_ID,
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';

@Injectable()
export class CashCollectionDeviceRepository extends ICashCollectionDeviceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: CashCollectionDevice,
  ): Promise<CashCollectionDevice> {
    const cashCollectionDeviceEntity =
      PrismaCashCollectionDeviceMapper.toPrisma(input);
    const cashCollectionDevice = await this.prisma.cashCollectionDevice.create({
      data: cashCollectionDeviceEntity,
    });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }

  public async createMany(input: CashCollectionDevice[]): Promise<any> {
    const cashCollectionDeviceEntities = input.map((item) =>
      PrismaCashCollectionDeviceMapper.toPrisma(item),
    );

    return this.prisma.cashCollectionDevice.createMany({
      data: cashCollectionDeviceEntities,
    });
  }

  public async findOneById(id: number): Promise<CashCollectionDevice> {
    const cashCollectionDevice =
      await this.prisma.cashCollectionDevice.findFirst({
        where: {
          id,
        },
      });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }

  public async findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDevice[]> {
    const cashCollectionDevices =
      await this.prisma.cashCollectionDevice.findMany({
        where: {
          cashCollectionId: cashCollectionId,
        },
        orderBy: {
          carWashDeviceId: 'asc',
        },
      });
    return cashCollectionDevices.map((cashCollectionDevice) =>
      PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice),
    );
  }

  public async findCalculateData(
    deviceIds: number[],
  ): Promise<CashCollectionDeviceCalculateResponseDto[]> {
    const calculateData = await this.prisma.$queryRaw<
      RawDeviceOperationsSummary[]
    >`
    WITH last_cash_collection AS (
      SELECT
        ccd."carWashDeviceId",
        ccd."tookMoneyTime" AS "oldTookMoneyTime"
      FROM
        "CashCollection" cc
      JOIN
        "CashCollectionDevice" ccd ON cc.id = ccd."cashCollectionId"
      WHERE
        cc."status" = 'SENT'
        AND cc."sendAt" = (SELECT MAX("sendAt") FROM "CashCollection" WHERE "status" = 'SENT' AND "sendAt" IS NOT NULL)
    ),
    last_event AS (
      SELECT
        "carWashDeviceId",
        MAX("eventDate") AS "tookMoneyTime"
      FROM
        "CarWashDeviceEvent"
      WHERE
        "carWashDeviceEventTypeId" = ${EVENT_TYPE_CASH_COLLECTION_ID}
      GROUP BY
        "carWashDeviceId"
    ),
    time_ranges AS (
      SELECT
        d.id AS "deviceId",
        COALESCE(lcc."oldTookMoneyTime",
                (date_trunc('day', CURRENT_DATE - INTERVAL '1 day') + INTERVAL '5 hours')::timestamp) AS "oldTookMoneyTime",
        COALESCE(le."tookMoneyTime",
                (date_trunc('day', CURRENT_DATE) + INTERVAL '5 hours')::timestamp) AS "tookMoneyTime"
      FROM
        "CarWashDevice" d
      LEFT JOIN
        last_cash_collection lcc ON d.id = lcc."carWashDeviceId"
      LEFT JOIN
        last_event le ON d.id = le."carWashDeviceId"
    ),
    device_programs AS (
      SELECT
        dpe."carWashDeviceId",
        dpe."beginDate",
        dpe."carWashDeviceProgramsTypeId",
        dpt.name AS "programName"
      FROM
        "CarWashDeviceProgramsEvent" dpe
      JOIN
        "CarWashDeviceProgramsType" dpt ON dpe."carWashDeviceProgramsTypeId" = dpt.id
    ),
    check_auto_programs AS (
      SELECT
        dp."carWashDeviceId",
        dp."beginDate",
        LAG(dp."beginDate") OVER (
          PARTITION BY dp."carWashDeviceId"
          ORDER BY dp."beginDate"
        ) AS "prevBeginDate"
      FROM
        device_programs dp
      WHERE
        dp."carWashDeviceProgramsTypeId" = ${PROGRAM_TYPE_ID_CHECK_AUTO}
    ),
    valid_check_auto AS (
      SELECT
        cap."carWashDeviceId",
        cap."beginDate"
      FROM
        check_auto_programs cap
      WHERE
        cap."prevBeginDate" IS NULL OR
        (EXTRACT(EPOCH FROM (cap."beginDate" - cap."prevBeginDate")) / 60 > ${PROGRAM_TIME_CHECK_AUTO})
    ),
    car_counts AS (
      SELECT
        vca."carWashDeviceId",
        COUNT(*) AS "carCount"
      FROM
        valid_check_auto vca
      JOIN
        time_ranges tr ON vca."carWashDeviceId" = tr."deviceId"
      WHERE
        vca."beginDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
      GROUP BY
        vca."carWashDeviceId"
    ),
    coin_operations AS (
      SELECT
        tr."deviceId",
        SUM(cwoe."operSum") AS "sumCoin"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON tr."deviceId" = cwoe."carWashDeviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND c."currencyView" = 'COIN'
      GROUP BY
        tr."deviceId"
    ),
    paper_operations AS (
      SELECT
        tr."deviceId",
        SUM(cwoe."operSum") AS "sumPaper"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON tr."deviceId" = cwoe."carWashDeviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND c."currencyView" = 'PAPER'
      GROUP BY
        tr."deviceId"
    ),
    virtual_operations AS (
      SELECT
        tr."deviceId",
        SUM(cwoe."operSum") AS "virtualSum"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON tr."deviceId" = cwoe."carWashDeviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND (c."currencyView" IS NULL OR (c."currencyView" != 'COIN' AND c."currencyView" != 'PAPER'))
      GROUP BY
        tr."deviceId"
    ),
    card_operations AS (
      SELECT
        tr."deviceId",
        SUM(cwoc."sum") AS "sumCard"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsCardEvent" cwoc ON tr."deviceId" = cwoc."carWashDeviceId"
      WHERE
        cwoc."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
      GROUP BY
        tr."deviceId"
    )
    SELECT
      d.id AS "deviceId",
      COALESCE(co."sumCoin", 0) AS "sumCoin",
      COALESCE(po."sumPaper", 0) AS "sumPaper",
      COALESCE(vo."virtualSum", 0) AS "virtualSum",
      COALESCE(cdo."sumCard", 0) AS "sumCard",
      COALESCE(cc."carCount", 0) AS "carCount",
      tr."oldTookMoneyTime",
      tr."tookMoneyTime"
    FROM
      "CarWashDevice" d
    JOIN
      time_ranges tr ON d.id = tr."deviceId"
    LEFT JOIN
      coin_operations co ON d.id = co."deviceId"
    LEFT JOIN
      paper_operations po ON d.id = po."deviceId"
    LEFT JOIN
      virtual_operations vo ON d.id = vo."deviceId"
    LEFT JOIN
      card_operations cdo ON d.id = cdo."deviceId"
    LEFT JOIN
        car_counts cc ON d.id = cc."carWashDeviceId"
    WHERE
      d.id = ANY(${deviceIds}::int[])
  `;

    return calculateData.map((calculate) =>
      PrismaCashCollectionDeviceMapper.toCalculateResponseDto(calculate),
    );
  }

  public async findRecalculateDataByDevice(
    cashCollectionDeviceId: number,
    tookMoneyTime: Date,
  ): Promise<CashCollectionDeviceCalculateResponseDto> {
    const calculateData = await this.prisma
      .$queryRaw<RawDeviceOperationsSummary>`
    WITH device_info AS (
      SELECT
        ccd."carWashDeviceId" AS "deviceId",
        ccd."oldTookMoneyTime"
      FROM
        "CashCollectionDevice" ccd
      WHERE
        ccd.id = ${cashCollectionDeviceId}
    ),
    time_ranges AS (
      SELECT
        di."deviceId",
        di."oldTookMoneyTime",
        ${tookMoneyTime}::timestamp AS "tookMoneyTime"
      FROM
        device_info di
    ),
    device_programs AS (
      SELECT
        dpe."beginDate",
        dpe."carWashDeviceProgramsTypeId"
      FROM
        "CarWashDeviceProgramsEvent" dpe
      JOIN
        time_ranges tr ON dpe."carWashDeviceId" = tr."deviceId"
      WHERE
        dpe."carWashDeviceId" = (SELECT "deviceId" FROM device_info)
    ),
    check_auto_programs AS (
      SELECT
        dp."beginDate",
        LAG(dp."beginDate") OVER (ORDER BY dp."beginDate") AS "prevBeginDate"
      FROM
        device_programs dp
      WHERE
        dp."carWashDeviceProgramsTypeId" = ${PROGRAM_TYPE_ID_CHECK_AUTO}
    ),
    valid_check_auto AS (
      SELECT
        cap."beginDate"
      FROM
        check_auto_programs cap
      WHERE
        cap."prevBeginDate" IS NULL OR
        (EXTRACT(EPOCH FROM (cap."beginDate" - cap."prevBeginDate")) / 60 > ${PROGRAM_TIME_CHECK_AUTO})
    ),
    car_counts AS (
      SELECT
        COUNT(*) AS "carCount"
      FROM
        valid_check_auto vca
      JOIN
        time_ranges tr ON 1=1
      WHERE
        vca."beginDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
    ),
    coin_operations AS (
      SELECT
        SUM(cwoe."operSum") AS "sumCoin"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON cwoe."carWashDeviceId" = tr."deviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND c."currencyView" = 'COIN'
    ),
    paper_operations AS (
      SELECT
        SUM(cwoe."operSum") AS "sumPaper"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON cwoe."carWashDeviceId" = tr."deviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND c."currencyView" = 'PAPER'
    ),
    virtual_operations AS (
      SELECT
        SUM(cwoe."operSum") AS "virtualSum"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsEvent" cwoe ON cwoe."carWashDeviceId" = tr."deviceId"
      JOIN
        "Currency" c ON cwoe."currencyId" = c.id
      WHERE
        cwoe."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
        AND (c."currencyView" IS NULL OR (c."currencyView" != 'COIN' AND c."currencyView" != 'PAPER'))
    ),
    card_operations AS (
      SELECT
        SUM(cwoc."sum") AS "sumCard"
      FROM
        time_ranges tr
      JOIN
        "CarWashDeviceOperationsCardEvent" cwoc ON cwoc."carWashDeviceId" = tr."deviceId"
      WHERE
        cwoc."operDate" BETWEEN tr."oldTookMoneyTime" AND tr."tookMoneyTime"
    )
    SELECT
      (SELECT "deviceId" FROM device_info) AS "deviceId",
      COALESCE((SELECT "sumCoin" FROM coin_operations), 0) AS "sumCoin",
      COALESCE((SELECT "sumPaper" FROM paper_operations), 0) AS "sumPaper",
      COALESCE((SELECT "virtualSum" FROM virtual_operations), 0) AS "virtualSum",
      COALESCE((SELECT "sumCard" FROM card_operations), 0) AS "sumCard",
      COALESCE((SELECT "carCount" FROM car_counts), 0) AS "carCount",
      (SELECT "oldTookMoneyTime" FROM time_ranges) AS "oldTookMoneyTime",
      ${tookMoneyTime}::timestamp AS "tookMoneyTime"
  `;

    return PrismaCashCollectionDeviceMapper.toCalculateResponseDto(
      calculateData[0],
    );
  }

  public async update(
    input: CashCollectionDevice,
  ): Promise<CashCollectionDevice> {
    const cashCollectionDeviceEntity =
      PrismaCashCollectionDeviceMapper.toPrisma(input);
    const cashCollectionDevice = await this.prisma.cashCollectionDevice.update({
      where: {
        id: input.id,
      },
      data: cashCollectionDeviceEntity,
    });
    return PrismaCashCollectionDeviceMapper.toDomain(cashCollectionDevice);
  }
}
