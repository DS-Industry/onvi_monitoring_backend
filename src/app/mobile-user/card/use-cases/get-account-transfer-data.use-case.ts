import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CardNotMatchExceptions } from '../exceptions/card-not-match.exceptions';
import { AccountTransferDataResponseDto } from '../controller/dto/card-orders.dto';

@Injectable()
export class GetAccountTransferDataUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(devNomer: string, user: any): Promise<AccountTransferDataResponseDto> {
    const targetCard = await this.findMethodsCardUseCase.getByDevNumber(devNomer);
    
    if (!targetCard) {
      throw new CardNotMatchExceptions(devNomer);
    }

    return {
      devNumber: targetCard.devNumber,
      balance: targetCard.balance,
      monthlyLimit: targetCard.monthlyLimit,
    };
  }
}

