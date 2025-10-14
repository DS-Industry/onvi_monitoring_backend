import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { PeriodType } from '../domain/periodType';

export class PeriodCalculator {
  static calculateNextDate(
    currentDate: Date,
    periodType: PeriodType,
    customPeriodDays?: number
  ): Date {
    switch (periodType) {
      case PeriodType.DAILY:
        return addDays(currentDate, 1);
      
      case PeriodType.WEEKLY:
        return addWeeks(currentDate, 1);
      
      case PeriodType.MONTHLY:
        return addMonths(currentDate, 1);
      
      case PeriodType.YEARLY:
        return addYears(currentDate, 1);
      
      case PeriodType.CUSTOM:
        if (!customPeriodDays || customPeriodDays <= 0) {
          throw new Error('Custom period days must be a positive number when using CUSTOM period type');
        }
        return addDays(currentDate, customPeriodDays);
      
      default:
        throw new Error(`Unsupported period type: ${periodType}`);
    }
  }

  static validatePeriodConfig(periodType: PeriodType, customPeriodDays?: number): boolean {
    if (periodType === PeriodType.CUSTOM) {
      if (!customPeriodDays || customPeriodDays <= 0) {
        throw new Error('Custom period days must be a positive number when using CUSTOM period type');
      }
      if (customPeriodDays > 365) {
        throw new Error('Custom period days cannot exceed 365 days');
      }
    } else if (customPeriodDays !== undefined && customPeriodDays !== null) {
      throw new Error(`Custom period days should not be provided for ${periodType} period type`);
    }
    
    return true;
  }
}
