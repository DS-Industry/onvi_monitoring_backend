import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';
import { CardNotMatchExceptions } from '../exceptions/card-not-match.exceptions';
import { AccountTransferDto } from '../controller/dto/card-orders.dto';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { CreateCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-create';

@Injectable()
export class TransferAccountUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly findMethodsClientUseCase: FindMethodsClientUseCase,
    private readonly cardRepository: ICardRepository,
    private readonly createCardBonusBankUseCase: CreateCardBonusBankUseCase,
  ) {}

  async execute(body: AccountTransferDto, user: any): Promise<any> {
    const clientId = user.props.id;
    
    const newCard = await this.findMethodsCardUseCase.getByClientId(clientId);
    
    if (!newCard) {
      throw new Error('User card not found');
    }

    const oldCard = await this.findMethodsCardUseCase.getByDevNumber(body.devNumber);
    
    if (!oldCard) {
      throw new CardNotMatchExceptions(body.devNumber);
    }

    const oldCardClient = await this.findMethodsClientUseCase.getById(oldCard.mobileUserId);
    
    if (!oldCardClient) {
      throw new CardNotMatchExceptions(body.devNumber);
    }

    const currentClient = await this.findMethodsClientUseCase.getById(clientId);
    
    if (!currentClient) {
      throw new Error('Current client not found');
    }

    if (oldCardClient.phone !== currentClient.phone) {
      throw new Error('Phone numbers do not match');
    }

    if (oldCard.balance < body.sum) {
      throw new Error('Insufficient balance on old card');
    }

    const newCardBalance = newCard.balance + body.sum;
    const oldCardBalance = oldCard.balance - body.sum;

    await this.updateCardUseCase.execute(
      { balance: newCardBalance },
      newCard,
    );

    if (oldCard.id) {
      const updatedOldCard = await this.findMethodsCardUseCase.getById(oldCard.id);
      if (updatedOldCard) {
        await this.updateCardUseCase.execute(
          { balance: oldCardBalance },
          updatedOldCard,
        );
      }
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    
    await this.createCardBonusBankUseCase.execute({
      cardMobileUserId: newCard.id,
      sum: body.sum,
      expiryAt: expiryDate,
    });

    return {
      success: true,
      transferred: body.sum,
      newCardBalance: newCardBalance,
      oldCardBalance: oldCardBalance,
      bonusExpiresAt: expiryDate,
      message: `Balance transfer completed. ${body.sum} transferred to your card as bonus (valid until ${expiryDate.toLocaleDateString()}).`,
    };
  }
}

