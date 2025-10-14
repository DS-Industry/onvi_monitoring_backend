import { Injectable, Inject } from '@nestjs/common';
import { ICardRepository } from '../domain/card.repository.interface';
import { IClientRepository } from '../domain/client.repository.interface';
import { IBonusOperRepository } from '../domain/bonus-oper.repository.interface';
import { ITransactionService } from '../domain/transaction.service.interface';
import { CardTransferDto } from '../controller/dto/card-transfer.dto';

@Injectable()
export class PostCardTransferUseCase {
  constructor(
    @Inject('ICardRepository') private readonly cardRepository: ICardRepository,
    @Inject('IClientRepository') private readonly clientRepository: IClientRepository,
    @Inject('IBonusOperRepository') private readonly bonusOperRepository: IBonusOperRepository,
    @Inject('ITransactionService') private readonly transactionService: ITransactionService,
  ) {}

  async execute(input: CardTransferDto, user: any): Promise<any> {
    const card = await this.cardRepository.findOneByUnqNumberWithClient(input.devNomer);
    
    if (!card) {
      throw new Error(`Card with number ${input.devNomer} not found`);
    }

    const oldClient = await this.clientRepository.findById(card.clientId!);

    if (!oldClient) {
      throw new Error('Old client not found');
    }

    if (oldClient.phone !== user.phone) {
      throw new Error('Phone numbers do not match');
    }
    
    const newCard = await this.cardRepository.findFirstByClientId(user.clientId);

    if (!newCard) {
      throw new Error('New client card not found');
    }

    const extId = this.generateUniqueExt();

    try {
      await this.transactionService.executeTransaction(async (tx) => {
        await this.cardRepository.delete(card.id, tx);

        await this.clientRepository.updateStatus(oldClient.id, 'BLOCKED', tx);

        await this.bonusOperRepository.create({
          cardId: newCard.id,
          operDate: new Date(),
          loadDate: new Date(),
          sum: input.balance,
          comment: `ONVI BALANCE TRANSFER ${extId}`,
          creatorId: 3, 
          typeId: 1, 
        }, tx);

        await this.cardRepository.updateBalance(newCard.id, newCard.getBalance() + input.balance, tx);
      });

      if (input.balance > 0 && input.balance >= 50) {
        return {
          message: 'Transfer completed successfully',
          extId,
          balanceProcessed: input.balance,
        };
      }

      return {
        message: 'Transfer completed successfully',
        extId,
      };
    } catch (error) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  private generateUniqueExt(): string {
    const prefix = 'Transaction';
    const uniqueId = Date.now();
    return `${prefix}_${uniqueId}`;
  }
}
