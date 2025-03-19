import { Injectable } from '@nestjs/common';
import { CardCreateDto } from '@loyalty/mobile-user/card/use-case/dto/card-create.dto';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

@Injectable()
export class CreateCardUseCase {
  constructor(
    private readonly cardRepository: ICardRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(data: CardCreateDto): Promise<Card> {
    const devNumber = data.devNumber ?? (await this.generateDevNomerCard());
    const number = data.number ?? (await this.generateNomerCard());

    const card = new Card({
      balance: 0,
      mobileUserId: data.mobileUserId,
      devNumber,
      number,
      monthlyLimit: data?.monthlyLimit,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
    return await this.cardRepository.create(card);
  }

  private async generateDevNomerCard() {
    let newNomer = 0;
    do {
      newNomer = this.generateRandom12DigitNumber();
    } while (await this.findMethodsCardUseCase.getByDevNumber(newNomer));
    return newNomer;
  }
  private async generateNomerCard() {
    let newNomer = 0;
    do {
      newNomer = this.generateRandom12DigitNumber();
    } while (await this.findMethodsCardUseCase.getByNumber(newNomer));
    return newNomer;
  }
  private generateRandom12DigitNumber() {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
