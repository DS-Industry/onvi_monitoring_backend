import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { LoyaltyProgramTransactionAnalyticsRequestDto } from '@platform-user/core-controller/dto/receive/loyalty-program-transaction-analytics-request.dto';
import { LoyaltyProgramTransactionAnalyticsResponseDto, TransactionDataPoint } from '@platform-user/core-controller/dto/response/loyalty-program-transaction-analytics-response.dto';

@Injectable()
export class GetLoyaltyProgramTransactionAnalyticsUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
    private readonly cardRepository: ICardRepository,
  ) {}

  async execute(request: LoyaltyProgramTransactionAnalyticsRequestDto): Promise<LoyaltyProgramTransactionAnalyticsResponseDto> {
    const loyaltyProgram = await this.loyaltyProgramRepository.findOneById(request.loyaltyProgramId);
    
    if (!loyaltyProgram) {
      throw new Error(`Loyalty program with ID ${request.loyaltyProgramId} not found`);
    }

    const { startDate, endDate } = this.calculateDateRange(request);

    const rawData = await this.cardRepository.getTransactionAnalyticsByLoyaltyProgramId(
      request.loyaltyProgramId,
      startDate,
      endDate,
    );

    const data = this.fillMissingDates(rawData, startDate, endDate);

    const totalAccruals = data.reduce((sum, item) => sum + item.accruals, 0);
    const totalDebits = data.reduce((sum, item) => sum + item.debits, 0);

    return {
      data,
      totalAccruals,
      totalDebits,
      period: this.getPeriodDescription(request),
    };
  }

  private calculateDateRange(request: LoyaltyProgramTransactionAnalyticsRequestDto): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let startDate: Date;

    switch (request.period || 'lastMonth') {
      case 'lastWeek':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'lastMonth':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'lastYear':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        startDate = request.startDate ? new Date(request.startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (request.endDate) {
          endDate.setTime(new Date(request.endDate).getTime());
        }
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
    }

    startDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  }

  private fillMissingDates(
    rawData: { date: Date; accruals: number; debits: number }[],
    startDate: Date,
    endDate: Date,
  ): TransactionDataPoint[] {
    const dataMap = new Map<string, { accruals: number; debits: number }>();
    
    rawData.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      dataMap.set(dateKey, { accruals: item.accruals, debits: item.debits });
    });

    const result: TransactionDataPoint[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const data = dataMap.get(dateString) || { accruals: 0, debits: 0 };
      
      result.push({
        date: dateString,
        accruals: data.accruals,
        debits: data.debits,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  private getPeriodDescription(request: LoyaltyProgramTransactionAnalyticsRequestDto): string {
    switch (request.period || 'lastMonth') {
      case 'lastWeek':
        return 'Last Week';
      case 'lastMonth':
        return 'Last Month';
      case 'lastYear':
        return 'Last Year';
      case 'custom':
        return 'Custom Period';
      default:
        return 'Last Month';
    }
  }
}
