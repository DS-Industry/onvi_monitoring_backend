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
import { LoyaltyException } from '@exception/option.exceptions';

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
    /*ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      checkLoyaltyProgram.object,
    );*/
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
    /*ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      loyaltyProgramCheck.object,
    );*/
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
    /*ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      loyaltyProgramCheck.object,
    );*/
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

  public async validateExcelCsvFileValidate(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    const response = await this.validateLib.validateExcelCsvFile(file);
    
    if (response.code !== 200) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        response.errorMessage || 'File validation failed'
      );
    }

    return response.object;
  }

  private extractLoyaltyProgramIds(ability: any): number[] {
    const userLoyaltyProgramIds: number[] = [];
    
    if (ability && ability.rules) {
      for (const rule of ability.rules) {
        if (rule.subject === 'LTYProgram' && rule.conditions && rule.conditions.id) {
          if (rule.conditions.id.in && Array.isArray(rule.conditions.id.in)) {
            userLoyaltyProgramIds.push(...rule.conditions.id.in);
          }
        }
      }
    }
    
    return userLoyaltyProgramIds;
  }

  public async getCorporateClientsValidate(
    organizationId: number,
    ability: any,
  ) {
    const response = [];
    
    const organizationCheck = await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
    
    return organizationCheck.object;
  }

  public async getCorporateClientByIdValidate(
    id: number,
    ability: any,
  ) {
    const response = [];
    
    const corporateClient = await this.validateLib.corporateClientByIdExists(id);
    response.push(corporateClient);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    
    const organizationId = corporateClient.object.organizationId;
    const organizationCheck = await this.validateLib.organizationByIdExists(organizationId);
    
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
    
    return corporateClient.object;
  }

  public async createCorporateClientValidate(
    organizationId: number,
    ability: any,
  ) {
    const response = [];
    
    const organizationCheck = await this.validateLib.organizationByIdExists(organizationId);
    response.push(organizationCheck);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
    );
    
    return organizationCheck.object;
  }

  public async updateCorporateClientValidate(
    id: number,
    ability: any,
  ) {
    const response = [];
    
    const corporateClient = await this.validateLib.corporateClientByIdExists(id);
    response.push(corporateClient);

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
    
    const organizationId = corporateClient.object.organizationId;
    const organizationCheck = await this.validateLib.organizationByIdExists(organizationId);
    
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      organizationCheck.object,
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

    const corporateClient = await this.validateLib.corporateClientByIdExists(corporateId);
    response.push(corporateClient);
    
    if (corporateClient.code === 200 && corporateClient.object) {
      const organizationId = corporateClient.object.organizationId;
      
      const organizationCheck = await this.validateLib.organizationByIdExists(organizationId);
      response.push(organizationCheck);
      
      if (organizationCheck.code === 200 && organizationCheck.object) {
        const organization = organizationCheck.object;
        
        if (!organization.ltyPrograms || organization.ltyPrograms.length === 0) {
          response.push({
            code: 404,
            errorMessage: 'Organization has no loyalty programs',
          });
        } else {
          const hasAccess = organization.ltyPrograms.some(program => 
            userLoyaltyProgramIds.includes(program.id)
          );
          
          if (!hasAccess) {
            response.push({
              code: 403,
              errorMessage: 'Access denied: You do not have access to this organization\'s loyalty programs',
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

  public async getCorporateCardsValidate(
    corporateId: number,
    ability: any,
  ) {
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
      ltyProgramId?: number;
      posIds: number[];
    },
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
    
    if (data.ltyProgramId) {
      const loyaltyProgramCheck = await this.validateLib.loyaltyProgramByIdExists(data.ltyProgramId);
      response.push(loyaltyProgramCheck);
      
      if (loyaltyProgramCheck.code === 200 && loyaltyProgramCheck.object) {
        const loyaltyProgram = loyaltyProgramCheck.object;
        
        if (!userLoyaltyProgramIds.includes(loyaltyProgram.id)) {
          response.push({
            code: 403,
            errorMessage: 'Access denied: You do not have access to this loyalty program',
          });
        }
      }
    }
    
    const posCheckPromises = data.posIds.map(posId => 
      this.validateLib.posByIdExists(posId)
    );
    const posCheckResults = await Promise.all(posCheckPromises);
    response.push(...posCheckResults);
    
    for (const posCheck of posCheckResults) {
      if (posCheck.code === 200 && posCheck.object) {
        const pos = posCheck.object;
        const organizationCheck = await this.validateLib.organizationByIdExists(pos.organizationId);
        response.push(organizationCheck);
        
        if (organizationCheck.code === 200 && organizationCheck.object) {
          const organization = organizationCheck.object;
          
          if (!organization.ltyPrograms || organization.ltyPrograms.length === 0) {
            response.push({
              code: 404,
              errorMessage: `Organization ${organization.name} has no loyalty programs`,
            });
          } else {
            const hasAccess = organization.ltyPrograms.some(program => 
              userLoyaltyProgramIds.includes(program.id)
            );
            
            if (!hasAccess) {
              response.push({
                code: 403,
                errorMessage: `Access denied: You do not have access to organization ${organization.name}'s loyalty programs`,
              });
            }
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

  public async getMarketingCampaignsValidate(ability: any) {
    const userLoyaltyProgramIds = this.extractLoyaltyProgramIds(ability);
    
    if (userLoyaltyProgramIds.length === 0) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        'Access denied: No loyalty program permissions',
      );
    }
  }

  public async getMarketingCampaignByIdValidate(campaignId: number, ability: any) {
    const userLoyaltyProgramIds = this.extractLoyaltyProgramIds(ability);
    
    if (userLoyaltyProgramIds.length === 0) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        'Access denied: No loyalty program permissions',
      );
    }

    const campaignCheck = await this.validateLib.marketingCampaignByIdExists(campaignId);
    
    if (campaignCheck.code !== 200 || !campaignCheck.object) {
      throw new LoyaltyException(
        LOYALTY_GET_ONE_EXCEPTION_CODE,
        'Marketing campaign not found',
      );
    }

    const campaign = campaignCheck.object;
    
    if (campaign.ltyProgramId && !userLoyaltyProgramIds.includes(campaign.ltyProgramId)) {
      throw new LoyaltyException(
        LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
        'Access denied: You do not have access to this marketing campaign',
      );
    }
  }

  public async updateMarketingCampaignValidate(
    campaignId: number,
    data: {
      ltyProgramId?: number;
      posIds?: number[];
    },
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
    
    const campaignCheck = await this.validateLib.marketingCampaignByIdExists(campaignId);
    response.push(campaignCheck);
    
    if (campaignCheck.code === 200 && campaignCheck.object) {
      const campaign = campaignCheck.object;
      
      if (campaign.ltyProgramId && !userLoyaltyProgramIds.includes(campaign.ltyProgramId)) {
        response.push({
          code: 403,
          errorMessage: 'Access denied: You do not have access to this campaign\'s loyalty program',
        });
      }
    }
    
    if (data.ltyProgramId) {
      const loyaltyProgramCheck = await this.validateLib.loyaltyProgramByIdExists(data.ltyProgramId);
      response.push(loyaltyProgramCheck);
      
      if (loyaltyProgramCheck.code === 200 && loyaltyProgramCheck.object) {
        const loyaltyProgram = loyaltyProgramCheck.object;
        
        if (!userLoyaltyProgramIds.includes(loyaltyProgram.id)) {
          response.push({
            code: 403,
            errorMessage: 'Access denied: You do not have access to this loyalty program',
          });
        }
      }
    }
    
    if (data.posIds) {
      const posCheckPromises = data.posIds.map(posId => 
        this.validateLib.posByIdExists(posId)
      );
      const posCheckResults = await Promise.all(posCheckPromises);
      response.push(...posCheckResults);
      
      for (const posCheck of posCheckResults) {
        if (posCheck.code === 200 && posCheck.object) {
          const pos = posCheck.object;
          const organizationCheck = await this.validateLib.organizationByIdExists(pos.organizationId);
          response.push(organizationCheck);
          
          if (organizationCheck.code === 200 && organizationCheck.object) {
            const organization = organizationCheck.object;
            
            if (!organization.ltyPrograms || organization.ltyPrograms.length === 0) {
              response.push({
                code: 404,
                errorMessage: `Organization ${organization.name} has no loyalty programs`,
              });
            } else {
              const hasAccess = organization.ltyPrograms.some(program => 
                userLoyaltyProgramIds.includes(program.id)
              );
              
              if (!hasAccess) {
                response.push({
                  code: 403,
                  errorMessage: `Access denied: You do not have access to organization ${organization.name}'s loyalty programs`,
                });
              }
            }
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
}
