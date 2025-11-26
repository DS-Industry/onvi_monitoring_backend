import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { CardImportItemDto } from '@platform-user/core-controller/dto/receive/card-import-item.dto';
import { ImportCardsResponseDto } from '@platform-user/core-controller/dto/response/import-cards-response.dto';
import { Card } from '@loyalty/mobile-user/card/domain/card';

@Injectable()
export class CardImportUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(
    organizationId: number,
    corporateId: number,
    tierId: number,
    cardsData: CardImportItemDto[],
  ): Promise<ImportCardsResponseDto> {
    const errors: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    const organizationExists =
      await this.cardRepository.validateOrganizationExists(organizationId);
    if (!organizationExists) {
      throw new Error(`Organization with id ${organizationId} not found`);
    }

    const tierExists =
      await this.cardRepository.validateTierExistsAndAccessible(
        tierId,
        organizationId,
      );

    if (!tierExists) {
      throw new Error(
        `Tier ${tierId} not found or not accessible for organization ${organizationId}`,
      );
    }

    for (const cardData of cardsData) {
      try {
        const cardExists = await this.cardRepository.checkCardExists(
          cardData.devNumber,
          cardData.uniqueNumber,
        );

        if (cardExists) {
          errors.push(
            `Card with unqNumber ${cardData.uniqueNumber} or number ${cardData.devNumber} already exists`,
          );
          errorCount++;
          continue;
        }

        const newCard = new Card({
          devNumber: cardData.uniqueNumber,
          number: cardData.devNumber,
          balance: 0,
          loyaltyCardTierId: tierId,
          corporateId: corporateId,
          mobileUserId: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await this.cardRepository.create(newCard);
        successCount++;
      } catch (error) {
        errors.push(
          `Error processing card ${cardData.devNumber}: ${error.message}`,
        );
        errorCount++;
      }
    }

    return {
      successCount,
      errorCount,
      errors,
      message: `Import completed. ${successCount} cards created successfully, ${errorCount} errors encountered.`,
    };
  }
}
