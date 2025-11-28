import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';
import { CardNotMatchExceptions } from '../exceptions/card-not-match.exceptions';
import { CardNotFoundExceptions } from '../exceptions/card-not-found.exceptions';
import { InsufficientBalanceExceptions } from '../exceptions/insufficient-balance.exceptions';
import { PhoneMismatchExceptions } from '../exceptions/phone-mismatch.exceptions';
import { AccountTransferDto } from '../controller/dto/card-orders.dto';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { CreateCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-create';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientNotFoundExceptions } from '@mobile-user/shared/exceptions/clinet.exceptions';

export interface TransferAccountResponse {
  success: boolean;
  transferred: number;
  newCardBalance: number;
  oldCardBalance: number;
  bonusExpiresAt: Date;
  message: string;
}

@Injectable()
export class TransferAccountUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly createCardBonusBankUseCase: CreateCardBonusBankUseCase,
  ) {}

  async execute(
    body: AccountTransferDto,
    user: Client,
  ): Promise<TransferAccountResponse> {
    if (!body.sum || body.sum <= 0) {
      throw new InsufficientBalanceExceptions(body.devNumber, 0, body.sum || 0);
    }

    if (!body.devNumber || body.devNumber.trim() === '') {
      throw new CardNotMatchExceptions(body.devNumber || '');
    }

    const clientId = user.id;

    const newCard = await this.findMethodsCardUseCase.getByClientId(clientId);

    if (!newCard) {
      throw new CardNotFoundExceptions(clientId);
    }

    const oldCard = await this.findMethodsCardUseCase.getByDevNumber(
      body.devNumber,
    );

    if (!oldCard) {
      throw new CardNotMatchExceptions(body.devNumber);
    }

    if (!oldCard.mobileUserId) {
      throw new CardNotMatchExceptions(body.devNumber);
    }

    const oldCardClient = await this.findMethodsClientUseCase.getById(
      oldCard.mobileUserId,
    );

    if (!oldCardClient) {
      throw new CardNotMatchExceptions(body.devNumber);
    }

    const currentClient = await this.findMethodsClientUseCase.getById(clientId);

    if (!currentClient) {
      throw new ClientNotFoundExceptions(clientId.toString());
    }

    if (oldCardClient.phone !== currentClient.phone) {
      throw new PhoneMismatchExceptions(
        oldCardClient.phone,
        currentClient.phone,
      );
    }

    if (oldCard.balance < body.sum) {
      throw new InsufficientBalanceExceptions(
        body.devNumber,
        oldCard.balance,
        body.sum,
      );
    }

    const newCardBalance = newCard.balance + body.sum;
    const oldCardBalance = oldCard.balance - body.sum;

    const updatedNewCard = await this.updateCardUseCase.execute(
      { balance: newCardBalance },
      newCard,
    );

    await this.updateCardUseCase.execute({ balance: oldCardBalance }, oldCard);

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);

    await this.createCardBonusBankUseCase.execute({
      cardMobileUserId: updatedNewCard.id,
      sum: body.sum,
      expiryAt: expiryDate,
    });

    return {
      success: true,
      transferred: body.sum,
      newCardBalance: updatedNewCard.balance,
      oldCardBalance,
      bonusExpiresAt: expiryDate,
      message: `Balance transfer completed. ${body.sum} transferred to your card as bonus (valid until ${expiryDate.toLocaleDateString()}).`,
    };
  }
}
