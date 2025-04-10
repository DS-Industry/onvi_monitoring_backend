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
} from '@constant/error.constants';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

@Injectable()
export class LoyaltyValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

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
    organizationIds?: number[],
  ): Promise<LoyaltyProgram> {
    const response = [];
    let organizationsCheckResults = [];

    const checkLoyaltyProgram =
      await this.validateLib.loyaltyProgramByIdExists(loyaltyProgramId);
    response.push(checkLoyaltyProgram);

    if (organizationIds) {
      const organizationsCheckPromises = organizationIds.map((orgId) =>
        this.validateLib.organizationByIdExists(orgId),
      );
      organizationsCheckResults = await Promise.all(organizationsCheckPromises);

      response.push(...organizationsCheckResults);

      const loyaltyProgramCheckPromises = organizationIds.map((orgId) =>
        this.validateLib.loyaltyProgramByOrganizationIdAndProgramIdNotExists(
          orgId,
          loyaltyProgramId,
        ),
      );
      const loyaltyProgramCheckResults = await Promise.all(
        loyaltyProgramCheckPromises,
      );

      response.push(...loyaltyProgramCheckResults);
    }
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
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      checkLoyaltyProgram.object,
    );
    return checkLoyaltyProgram.object;
  }

  public async getLoyaltyProgramValidate(
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
      PermissionAction.read,
      loyaltyProgramCheck.object,
    );
    return loyaltyProgramCheck.object;
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
      if (
        loyaltyTierCheck.object &&
        loyaltyTierCheck.object.limitBenefit !== undefined
      ) {
        if (benefitIds.length > loyaltyTierCheck.object.limitBenefit) {
          response.push({
            code: 400,
            errorMessage: 'The benefit limit has been exceeded',
          });
        }
      }

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

  public async testOperValidate(
    typeOperId: number,
    cardMobileUserId: number,
    carWashDeviceId?: number,
  ): Promise<Card> {
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
    tagIds: number[],
    devNumber?: number,
    number?: number,
  ) {
    const response = [];
    response.push(await this.validateLib.clientByPhoneNotExists(phone));
    response.push(await this.validateLib.tagIdsExists(tagIds));
    if (devNumber) {
      response.push(await this.validateLib.cardByDevNumberNotExists(devNumber));
    }
    if (number) {
      response.push(await this.validateLib.cardByNumberNotExists(number));
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async getClientByIdValidate(id: number): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
    response.push(checkClient);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_GET_ONE_EXCEPTION_CODE,
    );
    return checkClient.object;
  }

  public async updateClientValidate(
    id: number,
    tagIds?: number[],
  ): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
    response.push(checkClient);
    if (tagIds) {
      response.push(await this.validateLib.tagIdsExists(tagIds));
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
    );
    return checkClient.object;
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
}
