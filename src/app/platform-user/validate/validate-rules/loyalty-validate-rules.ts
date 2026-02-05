import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import {
  LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
  LOYALTY_CREATE_TAG_EXCEPTION_CODE,
  LOYALTY_DELETE_TAG_EXCEPTION_CODE,
  LOYALTY_GET_ONE_EXCEPTION_CODE,
  LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
  LOYALTY_DELETE_TIER_WITH_CARDS_EXCEPTION_CODE,
  LOYALTY_DELETE_CLIENT_EXCEPTION_CODE,
} from '@constant/error.constants';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { LoyaltyException } from '@exception/option.exceptions';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';

@Injectable()
export class LoyaltyValidateRules {
  constructor(
    private readonly validateLib: ValidateLib,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly cardRepository: ICardRepository,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
  ) {}

  public async createLoyaltyProgramValidate(
    organizationIds: number[],
    ability: any,
  ) {
    const response = [];
    const organizationsCheckPromises = organizationIds.map((orgId) =>
      this.validateLib.organizationByIdExists(orgId),
    );
    const organizationsCheckResults = await Promise.all(
      organizationsCheckPromises,
    );

    response.push(...organizationsCheckResults);

    const loyaltyProgramCheckPromises = organizationIds.map((orgId) =>
      this.validateLib.loyaltyProgramByOrganizationIdNotExists(orgId),
    );
    const loyaltyProgramCheckResults = await Promise.all(
      loyaltyProgramCheckPromises,
    );

    response.push(...loyaltyProgramCheckResults);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    organizationsCheckResults.forEach((orgCheck) => {
      ForbiddenError.from(ability).throwUnlessCan(
        PermissionAction.read,
        orgCheck.object,
      );
    });
  }

  public async updateLoyaltyProgramValidate(
    loyaltyProgramId: number,
    ability: any,
  ): Promise<LTYProgram> {
    const response = [];

    const checkLoyaltyProgram =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);
    response.push(checkLoyaltyProgram);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      checkLoyaltyProgram.object,
    );
    return checkLoyaltyProgram.object;
  }

  public async getLoyaltyProgramValidate(
    loyaltyProgramId: number,
    ability: any,
    userId: number,
  ) {
    const response = [];
    const loyaltyProgramCheck =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);
    response.push(loyaltyProgramCheck);

    const userBelongsToOrganizations =
      await this.validateLib.userBelongsToOrganizations(
        userId,
        loyaltyProgramCheck.object.programParticipantOrganizationIds,
      );

    if (userBelongsToOrganizations.code !== 200) {
      response.push(userBelongsToOrganizations);
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      loyaltyProgramCheck.object,
    );

    return loyaltyProgramCheck.object;
  }

  public async createLoyaltyProgramParticipantRequestValidate(
    loyaltyProgramId: number,
    organizationId: number,
    userId: number,
  ): Promise<{ loyaltyProgram: any; organization: any }> {
    const response = [];

    const loyaltyProgramCheck =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);
    response.push(loyaltyProgramCheck);

    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    const userBelongsToOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);
    response.push(userBelongsToOrganization);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    if (userBelongsToOrganization.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        userBelongsToOrganization.errorMessage,
      );
    }

    return {
      loyaltyProgram: loyaltyProgramCheck.object,
      organization: organizationCheck.object,
    };
  }

  public async createLoyaltyTierValidate(
    loyaltyProgramId: number,
    ability: any,
  ) {
    const response = [];
    const loyaltyProgramCheck =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);
    response.push(loyaltyProgramCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      loyaltyProgramCheck.object,
    );
  }

  public async updateLoyaltyTierValidate(
    loyaltyTierId: number,
    benefitIds?: number[],
  ) {
    const response = [];
    const loyaltyTierCheck =
      await this.validateLib.loyaltyTierByIdExists(loyaltyTierId);
    response.push(loyaltyTierCheck);

    if (benefitIds) {
      await Promise.all(
        benefitIds.map(async (item) => {
          response.push(await this.validateLib.benefitByIdExists(item));
        }),
      );
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    return loyaltyTierCheck.object;
  }

  public async getLoyaltyTierValidate(loyaltyTierId: number) {
    const response = [];
    const loyaltyTierCheck =
      await this.validateLib.loyaltyTierByIdExists(loyaltyTierId);
    response.push(loyaltyTierCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    return loyaltyTierCheck.object;
  }

  public async createBenefitValidate(benefitActionId: number) {
    const response = [];
    const benefitActionCheck =
      await this.validateLib.benefitActionByIdExists(benefitActionId);
    response.push(benefitActionCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async getBenefitByIdValidate(benefitId: number) {
    const response = [];
    const benefitCheck = await this.validateLib.benefitByIdExists(benefitId);
    response.push(benefitCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    return benefitCheck.object;
  }

  public async testOperValidate(cardMobileUserId: number): Promise<Card> {
    const response = [];
    const checkCard = await this.validateLib.cardByIdExists(cardMobileUserId);
    response.push(checkCard);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    return checkCard.object;
  }

  public async cardBenefitValidate(cardMobileUserId: number): Promise<Card> {
    const response = [];
    const checkCard = await this.validateLib.cardByIdExists(cardMobileUserId);
    response.push(checkCard);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    return checkCard.object;
  }

  public async createClientValidate(
    phone: string,
    ability: any,
    cardId: number,
    tagIds?: number[],
    devNumber?: string,
    number?: string,
  ) {
    const response = [];
    response.push(await this.validateLib.clientByPhoneNotExists(phone));
    if (tagIds && tagIds.length > 0) {
      response.push(await this.validateLib.tagIdsExists(tagIds));
    }
    if (devNumber) {
      response.push(await this.validateLib.cardByDevNumberNotExists(devNumber));
    }
    if (number) {
      response.push(await this.validateLib.cardByNumberNotExists(number));
    }

    const cardAccessCheck =
      await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
        cardId,
        ability,
      );
    response.push(cardAccessCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async getClientByIdValidate(
    id: number,
    ability: any,
  ): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
    response.push(checkClient);

    if (checkClient.object) {
      const card = await this.findMethodsCardUseCase.getByClientId(
        checkClient.object.id,
      );

      if (card) {
        const cardAccessCheck =
          await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
            card.id,
            ability,
          );
        response.push(cardAccessCheck);
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_GET_ONE_EXCEPTION_CODE,
    );

    return checkClient.object;
  }

  public async updateClientValidate(
    id: number,
    ability: any,
    cardId: number,
    tagIds?: number[],
    status?: StatusUser, 
  ): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
        
    response.push(checkClient);
    if (tagIds) {
      response.push(await this.validateLib.tagIdsExists(tagIds));
    }

    const cardToCheck = cardId || checkClient.object?.cardId;
    if (cardToCheck) {
      const cardAccessCheck =
        await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
          cardToCheck,
          ability,
        );
      response.push(cardAccessCheck);
    }

    if (status === StatusUser.DELETED) {      
      if (checkClient.object.deletedAt) {        
        throw new LoyaltyException(
          LOYALTY_DELETE_CLIENT_EXCEPTION_CODE,
          'The client has already been deleted',
        );
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      status === StatusUser.DELETED 
        ? LOYALTY_DELETE_CLIENT_EXCEPTION_CODE
        : LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
    );
    return checkClient.object;
  }

  public async assignCardToClientValidate(
    cardId: number,
    clientId: number,
    ability: any,
  ): Promise<Card> {
    const response = [];
    
    const checkCard = await this.validateLib.cardByIdExists(cardId);
    response.push(checkCard);
    
    const checkClient = await this.validateLib.clientByIdExists(clientId);
    response.push(checkClient);

    if (checkCard.object && checkCard.object.mobileUserId) {
      if (checkCard.object.mobileUserId !== clientId) {
        response.push({
          code: 400,
          errorMessage: 'Card is already assigned to another client',
        });
      }
    }

    const existingCard = await this.findMethodsCardUseCase.getByClientId(
      clientId,
    );
    if (existingCard && existingCard.id !== cardId && existingCard.balance !== 0) {
      response.push({
        code: 400,
        errorMessage: 'Cannot reassign card: current card balance is not zero',
      });
    }

    const cardAccessCheck =
      await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
        cardId,
        ability,
      );
    response.push(cardAccessCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
    );
    
    return checkCard.object;
  }

  public async createTagValidate(name: string) {
    const response = [];
    response.push(await this.validateLib.tegByNameNotExists(name));
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_TAG_EXCEPTION_CODE,
    );
  }

  public async deleteTagValidate(id: number): Promise<Tag> {
    const response = [];
    const checkTag = await this.validateLib.tegByIdExists(id);
    response.push(checkTag);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_DELETE_TAG_EXCEPTION_CODE,
    );
    return checkTag.object;
  }

  public async deleteLoyaltyTierValidate(id: number): Promise<LoyaltyTier> {
    const response = [];
    const checkLoyaltyTier = await this.validateLib.loyaltyTierByIdExists(id);
    response.push(checkLoyaltyTier);

    const cardsUsingTier = await this.cardRepository.findCardsByTierId(id);
    if (cardsUsingTier.length > 0) {
      response.push({
        code: 400,
        errorMessage: `Cannot delete tier. ${cardsUsingTier.length} card(s) are currently using this tier.`,
      });
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_DELETE_TIER_WITH_CARDS_EXCEPTION_CODE,
    );
    return checkLoyaltyTier.object;
  }

  public async validateExcelCsvFileValidate(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    const response = await this.validateLib.validateExcelCsvFile(file);

    if (response.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        response.errorMessage || 'File validation failed',
      );
    }

    return response.object;
  }

  private extractLoyaltyProgramIds(ability: any): number[] {
    const userLoyaltyProgramIds: number[] = [];

    if (ability && ability.rules) {
      for (const rule of ability.rules) {
        if (
          rule.subject === 'LTYProgram' &&
          rule.conditions &&
          rule.conditions.id
        ) {
          if (rule.conditions.id.in && Array.isArray(rule.conditions.id.in)) {
            userLoyaltyProgramIds.push(...rule.conditions.id.in);
          }
        }
      }
    }

    return userLoyaltyProgramIds;
  }

  private extractOrganizationIds(ability: any): number[] {
    const userOrganizationIds: number[] = [];

    if (ability && ability.rules) {
      for (const rule of ability.rules) {
        if (
          rule.subject === 'Pos' &&
          rule.conditions &&
          rule.conditions.organizationId
        ) {
          if (
            rule.conditions.organizationId.in &&
            Array.isArray(rule.conditions.organizationId.in)
          ) {
            userOrganizationIds.push(...rule.conditions.organizationId.in);
          }
        }
      }
    }

    return userOrganizationIds;
  }

  public async getCorporateClientsValidate(
    organizationId: number,
    ability: any,
  ) {
    const response = [];

    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    const loyaltyProgramCheck =
      await this.validateLib.loyaltyProgramByOwnerOrganizationIdExists(
        organizationId,
      );
    response.push(loyaltyProgramCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      loyaltyProgramCheck.object,
    );

    return loyaltyProgramCheck.object;
  }

  public async getCorporateClientByIdValidate(id: number, userId: number) {
    const response = [];

    const corporateClient =
      await this.validateLib.corporateClientByIdExists(id);
    response.push(corporateClient);

    const organizationId = corporateClient.object.organizationId;
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);

    response.push(organizationCheck);

    const accesTooOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);
    response.push(accesTooOrganization);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return corporateClient.object;
  }

  public async createCorporateClientValidate(
    organizationId: number,
    userId: number,
  ) {
    const response = [];
    const accesTooOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);
    response.push(accesTooOrganization);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return accesTooOrganization;
  }

  public async updateCorporateClientValidate(id: number, userId: number) {
    const response = [];

    const corporateClient =
      await this.validateLib.corporateClientByIdExists(id);
    response.push(corporateClient);

    const organizationId = corporateClient.object.organizationId;
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    const accesTooOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);

    response.push(accesTooOrganization);
    response.push(organizationCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return corporateClient.object;
  }

  private async validateCorporateClientAccess(
    corporateId: number,
    ability: any,
  ) {
    const response = [];

    const userLoyaltyProgramIds = this.extractLoyaltyProgramIds(ability);

    if (userLoyaltyProgramIds.length === 0) {
      response.push({
        code: 403,
        errorMessage: 'Access denied: No loyalty program permissions',
      });
    }

    const corporateClient =
      await this.validateLib.corporateClientByIdExists(corporateId);
    response.push(corporateClient);

    if (corporateClient.code === 200 && corporateClient.object) {
      const organizationId = corporateClient.object.organizationId;

      const organizationCheck =
        await this.validateLib.organizationByIdExists(organizationId);
      response.push(organizationCheck);

      if (organizationCheck.code === 200 && organizationCheck.object) {
        const organization = organizationCheck.object;

        if (
          !organization.ltyPrograms ||
          organization.ltyPrograms.length === 0
        ) {
          response.push({
            code: 404,
            errorMessage: 'Organization has no loyalty programs',
          });
        } else {
          const hasAccess = organization.ltyPrograms.some((program) =>
            userLoyaltyProgramIds.includes(program.id),
          );

          if (!hasAccess) {
            response.push({
              code: 403,
              errorMessage:
                "Access denied: You do not have access to this organization's loyalty programs",
            });
          }
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return corporateClient.object;
  }

  public async getCorporateCardsValidate(corporateId: number, ability: any) {
    return await this.validateCorporateClientAccess(corporateId, ability);
  }

  public async getCorporateCardsOperationsValidate(
    corporateId: number,
    ability: any,
  ) {
    return await this.validateCorporateClientAccess(corporateId, ability);
  }

  public async createMarketingCampaignValidate(
    data: {
      ltyProgramParticipantId: number;
      posIds?: number[];
    },
    ability: any,
  ) {
    const response = [];

    const userOrganizationIds = this.extractOrganizationIds(ability);

    if (userOrganizationIds.length === 0) {
      response.push({
        code: 403,
        errorMessage: 'Access denied: No organization permissions',
      });
    }

    const participantCheck =
      await this.validateLib.ltyProgramParticipantByIdExists(
        data.ltyProgramParticipantId,
      );
    response.push(participantCheck);

    if (participantCheck.code !== 200 || !participantCheck.object) {
      response.push({
        code: 400,
        errorMessage: 'The loyalty program participant does not exist',
      });
    }

    if (!userOrganizationIds.includes(participantCheck.object.organizationId)) {
      response.push({
        code: 403,
        errorMessage:
          'Access denied: You do not have access to this organization',
      });
    }

    if (data.posIds && data.posIds.length > 0) {
      const posCheckPromises = data.posIds.map((posId) =>
        this.validateLib.posByIdExists(posId),
      );
      const posCheckResults = await Promise.all(posCheckPromises);
      response.push(...posCheckResults);

      for (const posCheck of posCheckResults) {
        if (posCheck.code === 200 && posCheck.object) {
          const pos = posCheck.object;

          if (!userOrganizationIds.includes(pos.organizationId)) {
            response.push({
              code: 403,
              errorMessage: `Access denied: You do not have access to POS organization ${pos.organizationId}`,
            });
          }
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async getMarketingCampaignsValidate(
    ability: any,
    organizationId: number,
  ) {
    const response = [];

    // First check if organization exists
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return organizationCheck.object;
  }

  public async getMarketingCampaignByIdValidate(
    campaignId: number,
    ability: any,
  ) {
    const campaignCheck =
      await this.validateLib.marketingCampaignByIdExists(campaignId);

    if (campaignCheck.code !== 200 || !campaignCheck.object) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        'Marketing campaign not found',
      );
    }

    const campaign = campaignCheck.object;

    if (campaign.ltyProgramId) {
      const loyaltyProgramCheck =
        await this.validateLib.loyaltyProgramByIdExists(campaign.ltyProgramId);

      if (loyaltyProgramCheck.code !== 200 || !loyaltyProgramCheck.object) {
        throw new LoyaltyException(
          LOYALTY_GET_ONE_EXCEPTION_CODE,
          'Loyalty program not found',
        );
      }

      ForbiddenError.from(ability).throwUnlessCan(
        PermissionAction.read,
        loyaltyProgramCheck.object,
      );
    }
  }

  public async getClientsValidate(organizationId: number, userId: number) {
    const response = [];

    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    const loyaltyProgramCheck =
      await this.validateLib.loyaltyProgramByOwnerOrganizationIdExists(
        organizationId,
      );
    response.push(loyaltyProgramCheck);

    const userBelongsToOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);
    response.push(userBelongsToOrganization);

    if (userBelongsToOrganization.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        userBelongsToOrganization.errorMessage,
      );
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );

    return loyaltyProgramCheck.object;
  }

  public async updateMarketingCampaignValidate(
    campaignId: number,
    data: {
      ltyProgramParticipantId?: number;
      posIds?: number[];
    },
    ability: any,
  ) {
    const response = [];

    const userOrganizationIds = this.extractOrganizationIds(ability);

    if (userOrganizationIds.length === 0) {
      response.push({
        code: 403,
        errorMessage: 'Access denied: No organization permissions',
      });
    }

    const campaignCheck =
      await this.validateLib.marketingCampaignByIdExists(campaignId);
    response.push(campaignCheck);

    if (campaignCheck.code !== 200 || !campaignCheck.object) {
      response.push({
        code: 400,
        errorMessage: 'The marketing campaign does not exist',
      });
    }

    if (data.ltyProgramParticipantId) {
      const participantCheck =
        await this.validateLib.ltyProgramParticipantByIdExists(
          data.ltyProgramParticipantId,
        );
      response.push(participantCheck);

      if (participantCheck.code !== 200 || !participantCheck.object) {
        response.push({
          code: 400,
          errorMessage: 'The loyalty program participant does not exist',
        });
      } else {
        if (
          !userOrganizationIds.includes(participantCheck.object.organizationId)
        ) {
          response.push({
            code: 403,
            errorMessage:
              'Access denied: You do not have access to this organization',
          });
        }
      }
    }

    if (data.posIds && data.posIds.length > 0) {
      const posCheckPromises = data.posIds.map((posId) =>
        this.validateLib.posByIdExists(posId),
      );
      const posCheckResults = await Promise.all(posCheckPromises);
      response.push(...posCheckResults);

      for (const posCheck of posCheckResults) {
        if (posCheck.code === 200 && posCheck.object) {
          const pos = posCheck.object;

          if (!userOrganizationIds.includes(pos.organizationId)) {
            response.push({
              code: 403,
              errorMessage: `Access denied: You do not have access to POS organization ${pos.organizationId}`,
            });
          }
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async requestHubValidate(
    loyaltyProgramId: number,
    ability: any,
  ): Promise<LTYProgram> {
    const loyaltyProgram =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);

    if (loyaltyProgram.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        loyaltyProgram.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      loyaltyProgram.object,
    );

    if (loyaltyProgram.object.isHub) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        'Loyalty program is already a hub',
      );
    }

    return loyaltyProgram.object;
  }

  public async approveHubValidate(
    loyaltyProgramId: number,
    ability: any,
  ): Promise<LTYProgram> {
    const loyaltyProgram =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);

    if (loyaltyProgram.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        loyaltyProgram.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );

    return loyaltyProgram.object;
  }

  public async rejectHubValidate(
    loyaltyProgramId: number,
    ability: any,
  ): Promise<any> {
    const loyaltyProgram =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);

    if (loyaltyProgram.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        loyaltyProgram.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );

    return loyaltyProgram.object;
  }

  public async getParticipantProgramsValidate(
    organizationId: number,
    ability: any,
  ) {
    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );

    return organizationCheck.object;
  }

  public async getHubRequestsValidate(ability: any): Promise<void> {
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );
  }

  public async approveParticipantRequestValidate(
    requestId: number,
    ability: any,
  ): Promise<any> {
    const participantRequest =
      await this.validateLib.participantRequestByIdExists(requestId);

    if (participantRequest.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        participantRequest.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );

    return participantRequest.object;
  }

  public async rejectParticipantRequestValidate(
    requestId: number,
    ability: any,
  ): Promise<any> {
    const participantRequest =
      await this.validateLib.participantRequestByIdExists(requestId);

    if (participantRequest.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        participantRequest.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );

    return participantRequest.object;
  }

  public async getParticipantRequestsValidate(ability: any): Promise<void> {
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.manage,
      'LTYProgram',
    );
  }

  public async validateUserBelongsToOrganization(
    userId: number,
    organizationId: number,
  ) {
    const response = await this.validateLib.userBelongsToOrganization(
      userId,
      organizationId,
    );

    if (response.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    return response.object;
  }

  public async getCardsPaginatedValidate(
    organizationId: number,
    userId: number,
  ) {
    const response = [];

    const organizationCheck =
      await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    const userBelongsToOrganization =
      await this.validateLib.userBelongsToOrganization(userId, organizationId);
    response.push(userBelongsToOrganization);

    if (userBelongsToOrganization.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        userBelongsToOrganization.errorMessage,
      );
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_GET_ONE_EXCEPTION_CODE,
    );
  }

  public async getCardInfoValidate(
    cardId: number,
    userId: number,
    ability: any,
  ): Promise<Card> {
    const response = [];

    const checkCard = await this.validateLib.cardByIdExists(cardId);
    response.push(checkCard);

    const cardAccessCheck =
      await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
        cardId,
        ability,
      );
    response.push(cardAccessCheck);

    const card = checkCard.object;
    if (!card) {
      this.validateLib.handlerArrayResponse(
        response,
        ExceptionType.LOYALTY,
        LOYALTY_GET_ONE_EXCEPTION_CODE,
      );
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        'Card not found',
      );
    }

    if (!card.loyaltyCardTierId) {
      this.validateLib.handlerArrayResponse(
        response,
        ExceptionType.LOYALTY,
        LOYALTY_GET_ONE_EXCEPTION_CODE,
      );
      return card;
    }

    const loyaltyProgram =
      await this.findMethodsLoyaltyProgramUseCase.getOneByLoyaltyCardTierId(
        card.loyaltyCardTierId,
      );

    if (loyaltyProgram) {
      const organizations =
        await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
          loyaltyProgram.id,
        );

      if (organizations.length > 0) {
        const organizationChecks = await Promise.all(
          organizations.map((org) =>
            this.validateLib.userBelongsToOrganization(userId, org.id),
          ),
        );

        const hasAccess = organizationChecks.some(
          (check) => check.code === 200,
        );
        if (!hasAccess) {
          throw new LoyaltyException(
            LOYALTY_GET_ONE_EXCEPTION_CODE,
            'User does not belong to the organization',
          );
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_GET_ONE_EXCEPTION_CODE,
    );

    return card;
  }

  public async updateCardValidate(
    cardId: number,
    cardTierId: number | undefined,
    userId: number,
    ability: any,
  ): Promise<Card> {
    const response = [];

    const checkCard = await this.validateLib.cardByIdExists(cardId);
    response.push(checkCard);

    const cardAccessCheck =
      await this.validateLib.cardBelongsToAccessibleLoyaltyProgram(
        cardId,
        ability,
      );
    response.push(cardAccessCheck);

    const card = checkCard.object;
    if (!card) {
      this.validateLib.handlerArrayResponse(
        response,
        ExceptionType.LOYALTY,
        LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
      );
      throw new LoyaltyException(
        LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
        'Card not found',
      );
    }

    if (!card.loyaltyCardTierId) {
      this.validateLib.handlerArrayResponse(
        response,
        ExceptionType.LOYALTY,
        LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
      );
      return card;
    }

    const loyaltyProgram =
      await this.findMethodsLoyaltyProgramUseCase.getOneByLoyaltyCardTierId(
        card.loyaltyCardTierId,
      );

    if (loyaltyProgram) {
      const organizations =
        await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
          loyaltyProgram.id,
        );

      if (organizations.length > 0) {
        const organizationChecks = await Promise.all(
          organizations.map((org) =>
            this.validateLib.userBelongsToOrganization(userId, org.id),
          ),
        );

        const hasAccess = organizationChecks.some(
          (check) => check.code === 200,
        );
        if (!hasAccess) {
          throw new LoyaltyException(
            LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
            'User does not belong to the organization',
          );
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
    );

    return card;
  }
}
