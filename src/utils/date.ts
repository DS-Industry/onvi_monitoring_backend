import { DateTime, DurationUnit } from 'luxon';

type GetDateWithFormatFormatInput = {
  date?: Date;
  format?: string;
};

export class DateUtils {
  static getDateStringWithFormat(
    input: Partial<GetDateWithFormatFormatInput> = {},
  ): string {
    if (!input?.date) {
      Object.assign(input, { date: DateUtils.getJSDate() });
    }

    if (!input?.format) {
      Object.assign(input, {
        format: process.env.DATE_FORMAT || 'dd-MM-yyyy HH:mm:ss',
      });
    }

    return DateTime.fromJSDate(input.date, { zone: 'utc' })
      .setZone(process.env.TZ || 'utc')
      .toFormat(input.format);
  }

  static getISODateString(): string {
    return DateTime.fromJSDate(DateUtils.getJSDate(), { zone: 'utc' })
      .setZone(process.env.TZ || 'utc')
      .toJSON();
  }

  static getJSDate(): Date {
    return DateTime.fromJSDate(DateTime.now().toJSDate(), { zone: 'utc' })
      .setZone(process.env.TZ || 'utc')
      .toJSDate();
  }

  static calculateDiff(
    date: Date,
    compareDate: Date,
    compareType: DurationUnit,
  ): Date {
    const date1 = DateTime.fromJSDate(date, { zone: 'utc' }).setZone(
      process.env.TZ || 'utc',
    );
    const date2 = DateTime.fromJSDate(compareDate, { zone: 'utc' }).setZone(
      process.env.TZ || 'utc',
    );

    return date1.diff(date2, compareType)[`${compareType}`];
  }

  static getDate(): DateTime {
    return DateTime.fromJSDate(DateUtils.getJSDate(), { zone: 'utc' }).setZone(
      process.env.TZ || 'utc',
    );
  }
}
