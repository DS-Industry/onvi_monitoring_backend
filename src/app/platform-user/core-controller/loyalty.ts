import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateLoyaltyAbility,
  ReadLoyaltyAbility,
  UpdateLoyaltyAbility,
  SuperAdminAbility,
} from '@common/decorators/abilities.decorator';
import { TagCreateDto } from '@platform-user/core-controller/dto/receive/tag-create.dto';
import { LoyaltyException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { LoyaltyValidateRules } from '@platform-user/validate/validate-rules/loyalty-validate-rules';
import { CreateTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-create';
import { DeleteTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-delete';
import { ClientCreateDto } from '@platform-user/core-controller/dto/receive/client-create.dto';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { ClientFullResponseDto } from '@platform-user/core-controller/dto/response/client-full-response.dto';
import { ClientFilterDto } from '@platform-user/core-controller/dto/receive/client-filter.dto';
import { FindByFilterClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-by-filter';
import { ClientUpdateDto } from '@platform-user/core-controller/dto/receive/client-update.dto';
import { UpdateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-update';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LoyaltyProgramParticipantResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-participant-response.dto';
import { LoyaltyParticipantProgramsFilterDto } from '@platform-user/core-controller/dto/receive/loyalty-participant-programs-filter.dto';
import { LoyaltyParticipantProgramsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/loyalty-participant-programs-paginated-response.dto';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { LoyaltyProgramCreateDto } from '@platform-user/core-controller/dto/receive/loyaltyProgram-create.dto';
import { CreateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-create';
import { LoyaltyProgramParticipantRequestDto } from '@platform-user/core-controller/dto/receive/loyalty-program-participant-request.dto';
import { CreateLoyaltyProgramParticipantRequestUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-request';
import { PublicLoyaltyProgramsFilterDto } from '@platform-user/core-controller/dto/receive/public-loyalty-programs-filter.dto';
import {
  PublicLoyaltyProgramResponseDto,
  PublicLoyaltyProgramsListResponseDto,
} from '@platform-user/core-controller/dto/response/public-loyalty-programs-response.dto';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { CreateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-create';
import { LoyaltyTierCreateDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-create.dto';
import { LoyaltyTierUpdateDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-update.dto';
import { UpdateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-update';
import { DeleteLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-delete';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';
import { BenefitActionCreateDto } from '@platform-user/core-controller/dto/receive/benefitAction-create.dto';
import { CreateBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-create';
import { FindMethodsBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-find-methods';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';
import { CreateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-create';
import { BenefitCreateDto } from '@platform-user/core-controller/dto/receive/benefit-create.dto';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';
import { LoyaltyTierFilterDto } from '@platform-user/core-controller/dto/receive/loyaltyTier-filter.dto';
import { LoyaltyTierGetOneResponseDto } from '@platform-user/core-controller/dto/response/loyaltyTier-get-one-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { LoyaltyProgramGetByIdResponseDto } from '@platform-user/core-controller/dto/response/loyaltyProgram-get-by-id-response.dto';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { OrderCreateDto } from '@platform-user/core-controller/dto/receive/orderCreate';
import {
  PlatformType,
  OrderStatus,
  ContractType,
  SendAnswerStatus,
  ExecutionStatus,
} from '@loyalty/order/domain/enums';
import { UpdateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-update';
import { BenefitUpdateDto } from '@platform-user/core-controller/dto/receive/benefit-update.dto';
import { GetBenefitsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-get-benefits';
import { CardBenefitDataDto } from '@loyalty/mobile-user/card/use-case/dto/card-benefit-data.dto';
import { ExpirationCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-expiration';
import { UpdateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-update';
import { LoyaltyProgramUpdateDto } from '@platform-user/core-controller/dto/receive/loyaltyProgram-update.dto';
import { CardsFilterDto } from './dto/receive/cards.filter.dto';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { ClientKeyStatsDto } from './dto/receive/client-key-stats.dto';
import { UserKeyStatsResponseDto } from './dto/response/user-key-stats-response.dto';
import { ClientLoyaltyStatsDto } from './dto/receive/client-loyalty-stats.dto';
import { ClientLoyaltyStatsResponseDto } from './dto/response/client-loyalty-stats-response.dto';
import { ClientPaginatedResponseDto } from './dto/response/client-paginated-response.dto';
import { ImportCardsDto } from './dto/receive/import-cards.dto';
import { ImportCardsResponseDto } from './dto/response/import-cards-response.dto';
import { CardImportUseCase } from '@loyalty/mobile-user/card/use-case/card-import';
import { FileParserService } from './services/excel-parser.service';

import { CorporateClientsFilterDto } from './dto/receive/corporate-clients-filter.dto';
import { CorporateClientsPaginatedResponseDto } from './dto/response/corporate-clients-paginated-response.dto';
import { CorporateClientResponseDto } from './dto/response/corporate-client-response.dto';
import { CorporateClientStatsResponseDto } from './dto/response/corporate-client-stats-response.dto';
import { CorporateClientCreateDto } from './dto/receive/corporate-client-create.dto';
import { CorporateClientUpdateDto } from './dto/receive/corporate-client-update.dto';
import { CorporateCardsFilterDto } from './dto/receive/corporate-cards-filter.dto';
import { CorporateCardsPaginatedResponseDto } from './dto/response/corporate-cards-paginated-response.dto';
import { CorporateCardsOperationsFilterDto } from './dto/receive/corporate-cards-operations-filter.dto';
import { CorporateCardsOperationsPaginatedResponseDto } from './dto/response/corporate-cards-operations-paginated-response.dto';
import { CorporateFindByFilterUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-find-by-filter';
import { CorporateGetByIdUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-by-id';
import { CorporateGetStatsByIdUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-stats-by-id';
import { MarketingCampaignCreateDto } from './dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from './dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from './dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from './dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignConditionsResponseDto } from './dto/response/marketing-campaign-condition-response.dto';
import { MarketingCampaignConditionResponseDto } from './dto/response/marketing-campaign-condition-response.dto';
import { CreateMarketingCampaignConditionDto } from './dto/receive/marketing-campaign-condition-create.dto';
import { MarketingCampaignsFilterDto } from './dto/receive/marketing-campaigns-filter.dto';
import { CreateMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-create';
import { UpdateMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-update';
import { FindMethodsMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-find-methods';
import { CreateMarketingCampaignConditionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-condition-create';
import { DeleteMarketingCampaignConditionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-condition-delete';
import { UpsertMarketingCampaignMobileDisplayUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-mobile-display-upsert';
import { CreateMarketingCampaignActionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-action-create';
import { UpdateMarketingCampaignActionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-action-update';
import { MarketingCampaignActionCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-create.dto';
import { MarketingCampaignActionUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-update.dto';
import { UpsertMarketingCampaignMobileDisplayDto } from './dto/receive/marketing-campaign-mobile-display-upsert.dto';
import { MarketingCampaignMobileDisplayResponseDto } from './dto/response/marketing-campaign-mobile-display-response.dto';
import { CorporateGetCardsUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-cards';
import { CorporateGetCardsOperationsUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-cards-operations';
import { CreateCorporateClientUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-create';
import { UpdateCorporateClientUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-update';
import { LoyaltyProgramHubRequestDto } from './dto/receive/loyalty-program-hub-request.dto';
import { LoyaltyProgramHubApproveDto } from './dto/receive/loyalty-program-hub-approve.dto';
import { LoyaltyProgramHubRejectDto } from './dto/receive/loyalty-program-hub-reject.dto';
import { LoyaltyHubRequestsFilterDto } from './dto/receive/loyalty-hub-requests-filter.dto';
import { LoyaltyHubRequestsListResponseDto } from './dto/response/loyalty-hub-requests-response.dto';
import { LoyaltyProgramHubRequestUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-request';
import { LoyaltyProgramHubApproveUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-approve';
import { LoyaltyProgramHubRejectUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-reject';
import { FindLoyaltyHubRequestsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-find-hub-requests';
import { LoyaltyProgramParticipantApproveDto } from './dto/receive/loyalty-program-participant-approve.dto';
import { LoyaltyProgramParticipantRejectDto } from './dto/receive/loyalty-program-participant-reject.dto';
import { LoyaltyParticipantRequestsFilterDto } from './dto/receive/loyalty-participant-requests-filter.dto';
import { LoyaltyParticipantRequestsListResponseDto } from './dto/response/loyalty-participant-requests-response.dto';
import { LoyaltyProgramParticipantApproveUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-approve';
import { LoyaltyProgramParticipantRejectUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-reject';
import { FindLoyaltyParticipantRequestsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-find-participant-requests';
import { UpdateBonusRedemptionRulesUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-update-bonus-redemption-rules';
import { BonusRedemptionRulesDto } from '@platform-user/core-controller/dto/receive/bonus-redemption-rules.dto';
import { GetParticipantPosesUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-participant-poses';
import { GetLoyaltyProgramAnalyticsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-analytics';
import { GetLoyaltyProgramTransactionAnalyticsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-transaction-analytics';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { LoyaltyProgramAnalyticsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-analytics-response.dto';
import { LoyaltyProgramTransactionAnalyticsRequestDto } from '@platform-user/core-controller/dto/receive/loyalty-program-transaction-analytics-request.dto';
import { LoyaltyProgramTransactionAnalyticsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-transaction-analytics-response.dto';
import { PublishLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-publish';
import { UnpublishLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-unpublish';
import { CreatePromocodeUseCase } from '@loyalty/marketing-campaign/use-cases/promocode-create';
import { PromocodeCreateDto } from '@platform-user/core-controller/dto/receive/promocode-create.dto';
import { PromocodeResponseDto } from './dto/response/promocode-response.dto';
import { MarketingCampaignActionResponseDto } from './dto/response/marketing-campaign-action-response.dto';
import { DeleteResponseDto } from './dto/response/delete-response.dto';
import { PrismaService } from '@db/prisma/prisma.service';

@Controller('loyalty')
export class LoyaltyController {
  constructor(
    private readonly createLoyaltyProgramUseCase: CreateLoyaltyProgramUseCase,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
    private readonly createLoyaltyTierUseCase: CreateLoyaltyTierUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly findByFilterClientUseCase: FindByFilterClientUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly findMethodsTagUseCase: FindMethodsTagUseCase,
    private readonly updateLoyaltyTierUseCase: UpdateLoyaltyTierUseCase,
    private readonly deleteLoyaltyTierUseCase: DeleteLoyaltyTierUseCase,
    private readonly createBenefitUseCase: CreateBenefitUseCase,
    private readonly createBenefitActionUseCase: CreateBenefitActionUseCase,
    private readonly findMethodsBenefitActionUseCase: FindMethodsBenefitActionUseCase,
    private readonly findMethodsBenefitUseCase: FindMethodsBenefitUseCase,
    private readonly loyaltyValidateRules: LoyaltyValidateRules,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly handlerOrderUseCase: HandlerOrderUseCase,
    private readonly updateBenefitUseCase: UpdateBenefitUseCase,
    private readonly getBenefitsCardUseCase: GetBenefitsCardUseCase,
    private readonly expirationCardBonusBankUseCase: ExpirationCardBonusBankUseCase,
    private readonly updateLoyaltyProgramUseCase: UpdateLoyaltyProgramUseCase,
    private readonly cardImportUseCase: CardImportUseCase,
    private readonly fileParserService: FileParserService,
    private readonly corporateFindByFilterUseCase: CorporateFindByFilterUseCase,
    private readonly corporateGetByIdUseCase: CorporateGetByIdUseCase,
    private readonly corporateGetStatsByIdUseCase: CorporateGetStatsByIdUseCase,
    private readonly corporateGetCardsUseCase: CorporateGetCardsUseCase,
    private readonly corporateGetCardsOperationsUseCase: CorporateGetCardsOperationsUseCase,
    private readonly createCorporateClientUseCase: CreateCorporateClientUseCase,
    private readonly updateCorporateClientUseCase: UpdateCorporateClientUseCase,
    private readonly createMarketingCampaignUseCase: CreateMarketingCampaignUseCase,
    private readonly updateMarketingCampaignUseCase: UpdateMarketingCampaignUseCase,
    private readonly findMethodsMarketingCampaignUseCase: FindMethodsMarketingCampaignUseCase,
    private readonly createMarketingCampaignConditionUseCase: CreateMarketingCampaignConditionUseCase,
    private readonly deleteMarketingCampaignConditionUseCase: DeleteMarketingCampaignConditionUseCase,
    private readonly upsertMarketingCampaignMobileDisplayUseCase: UpsertMarketingCampaignMobileDisplayUseCase,
    private readonly createMarketingCampaignActionUseCase: CreateMarketingCampaignActionUseCase,
    private readonly updateMarketingCampaignActionUseCase: UpdateMarketingCampaignActionUseCase,
    private readonly loyaltyProgramHubRequestUseCase: LoyaltyProgramHubRequestUseCase,
    private readonly loyaltyProgramHubApproveUseCase: LoyaltyProgramHubApproveUseCase,
    private readonly loyaltyProgramHubRejectUseCase: LoyaltyProgramHubRejectUseCase,
    private readonly findLoyaltyHubRequestsUseCase: FindLoyaltyHubRequestsUseCase,
    private readonly createLoyaltyProgramParticipantRequestUseCase: CreateLoyaltyProgramParticipantRequestUseCase,
    private readonly loyaltyProgramParticipantApproveUseCase: LoyaltyProgramParticipantApproveUseCase,
    private readonly loyaltyProgramParticipantRejectUseCase: LoyaltyProgramParticipantRejectUseCase,
    private readonly findLoyaltyParticipantRequestsUseCase: FindLoyaltyParticipantRequestsUseCase,
    private readonly updateBonusRedemptionRulesUseCase: UpdateBonusRedemptionRulesUseCase,
    private readonly getParticipantPosesUseCase: GetParticipantPosesUseCase,
    private readonly getLoyaltyProgramAnalyticsUseCase: GetLoyaltyProgramAnalyticsUseCase,
    private readonly getLoyaltyProgramTransactionAnalyticsUseCase: GetLoyaltyProgramTransactionAnalyticsUseCase,
    private readonly publishLoyaltyProgramUseCase: PublishLoyaltyProgramUseCase,
    private readonly unpublishLoyaltyProgramUseCase: UnpublishLoyaltyProgramUseCase,
    private readonly createPromocodeUseCase: CreatePromocodeUseCase,
    private readonly prisma: PrismaService,
  ) {}
  @Post('test-oper')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async testOper() // @Request() req: any,
  //@Body() data: CardBonusOperCreateDto,
  : Promise<any> {
    try {
      /*const { user, ability } = req;
      const card = await this.loyaltyValidateRules.testOperValidate(
        data.typeOperId,
        data.cardMobileUserId,
        data?.carWashDeviceId,
      );
      return await this.createCardBonusOperUseCase.execute(
        { ...data, creatorId: user.id },
        card,
      );*/
      return await this.expirationCardBonusBankUseCase.execute();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post('test-order')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async testOrder(
    @Request() req: any,
    @Body() data: OrderCreateDto,
  ): Promise<any> {
    try {
      const handlerData = {
        ...data,
        platform: data.platform as PlatformType,
        orderStatus: data.orderStatus as OrderStatus,
        typeMobileUser: data.typeMobileUser
          ? (data.typeMobileUser as ContractType)
          : undefined,
        sendAnswerStatus: data.sendAnswerStatus
          ? (data.sendAnswerStatus as SendAnswerStatus)
          : undefined,
        executionStatus: data.executionStatus
          ? (data.executionStatus as ExecutionStatus)
          : undefined,
      };
      return await this.handlerOrderUseCase.execute(handlerData);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create program
  @Post('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createPrograms(
    @Request() req: any,
    @Body() data: LoyaltyProgramCreateDto,
  ): Promise<LTYProgram> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.validateUserBelongsToOrganization(
        user.id,
        Number(data.ownerOrganizationId),
      );

      return await this.createLoyaltyProgramUseCase.execute(
        {
          name: data.name,
          description: data.description,
          maxLevels: data.maxLevels,
          ownerOrganizationId: data.ownerOrganizationId,
          lifetimeDays: data?.lifetimeDays,
        },
        user,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post('promocode')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createPromocode(
    @Request() req: any,
    @Body() data: PromocodeCreateDto,
  ): Promise<PromocodeResponseDto> {
    try {
      const { user, ability } = req;

      if (data.campaignId) {
        await this.loyaltyValidateRules.updateMarketingCampaignValidate(
          data.campaignId,
          {},
          ability,
        );
      }

      return await this.createPromocodeUseCase.execute(data, user.id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  //Update program
  @Patch('program')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updatePrograms(
    @Request() req: any,
    @Body() data: LoyaltyProgramUpdateDto,
  ): Promise<LTYProgram> {
    try {
      const { ability } = req;
      const loyaltyProgram =
        await this.loyaltyValidateRules.updateLoyaltyProgramValidate(
          data.loyaltyProgramId,
          ability,
        );
      return await this.updateLoyaltyProgramUseCase.execute(
        data,
        loyaltyProgram,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Patch('program/bonus-redemption-rules')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updateBonusRedemptionRules(
    @Request() req: any,
    @Body() data: BonusRedemptionRulesDto,
  ): Promise<LTYProgram> {
    try {
      const { ability } = req;
      const loyaltyProgram =
        await this.loyaltyValidateRules.updateLoyaltyProgramValidate(
          data.loyaltyProgramId,
          ability,
        );
      return await this.updateBonusRedemptionRulesUseCase.execute(
        data,
        loyaltyProgram,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Patch('program/:id/publish')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async publishProgram(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LTYProgram> {
    try {
      const { ability } = req;
      await this.loyaltyValidateRules.updateLoyaltyProgramValidate(id, ability);

      return await this.publishLoyaltyProgramUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Patch('program/:id/unpublish')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async unpublishProgram(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LTYProgram> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.updateLoyaltyProgramValidate(id, ability);

      return await this.unpublishLoyaltyProgramUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('programs')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getPrograms(
    @Request() req: any,
    @Query('organizationId') organizationId?: string,
  ): Promise<LTYProgram[]> {
    try {
      const { ability } = req;

      return await this.findMethodsLoyaltyProgramUseCase.getAllByAbility(
        ability,
        organizationId ? Number(organizationId) : undefined,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('public-programs')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getPublicPrograms(
    @Request() req: any,
    @Query() filters: PublicLoyaltyProgramsFilterDto,
  ): Promise<PublicLoyaltyProgramsListResponseDto> {
    try {
      const programs =
        await this.findMethodsLoyaltyProgramUseCase.getAllPublicPrograms(
          filters,
        );

      const programResponses: PublicLoyaltyProgramResponseDto[] = programs.map(
        (program) => ({
          id: program.id,
          name: program.name,
          status: program.status,
          startDate: program.startDate,
          lifetimeDays: program.lifetimeDays,
          ownerOrganizationId: program.ownerOrganizationId,
          isHub: program.isHub,
          isPublic: program.isPublic,
        }),
      );

      return {
        programs: programResponses,
        total: programResponses.length,
        page: filters.page || 1,
        size: filters.size || 10,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('participant-programs')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getParticipantPrograms(
    @Request() req: any,
    @Query('organizationId') organizationId?: string,
  ): Promise<LoyaltyProgramParticipantResponseDto[]> {
    try {
      const { user } = req;

      if (!organizationId) {
        throw new CustomHttpException({
          message: 'Organization ID is required',
          code: HttpStatus.BAD_REQUEST,
        });
      }

      await this.loyaltyValidateRules.validateUserBelongsToOrganization(
        user.id,
        Number(organizationId),
      );

      return await this.findMethodsLoyaltyProgramUseCase.getAllParticipantProgramsByOrganizationId(
        Number(organizationId),
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('participant-programs-paginated')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getParticipantProgramsPaginated(
    @Request() req: any,
    @Query() params: LoyaltyParticipantProgramsFilterDto,
  ): Promise<LoyaltyParticipantProgramsPaginatedResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.validateUserBelongsToOrganization(
        user.id,
        params.organizationId,
      );

      return await this.findMethodsLoyaltyProgramUseCase.getAllParticipantProgramsByOrganizationIdPaginated(
        params.organizationId,
        params.page,
        params.size,
        params.status,
        params.participationRole,
        params.search,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  //Get program by id
  @Get('program/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getProgram(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyProgramGetByIdResponseDto> {
    try {
      const { ability, user } = req;
      const loyaltyProgram =
        await this.loyaltyValidateRules.getLoyaltyProgramValidate(
          id,
          ability,
          user.id,
        );
      const organizations =
        await this.findMethodsOrganizationUseCase.getAllByLoyaltyProgramId(
          loyaltyProgram.id,
        );

      return {
        id: loyaltyProgram.id,
        name: loyaltyProgram.name,
        status: loyaltyProgram.status,
        startDate: loyaltyProgram.startDate,
        isHub: loyaltyProgram.isHub,
        isHubRequested: loyaltyProgram.isHubRequested,
        isHubRejected: loyaltyProgram.isHubRejected,
        organizations: organizations.map((item) => {
          return { id: item.id, name: item.name };
        }),
        lifetimeDays: loyaltyProgram?.lifetimeDays,
        description: loyaltyProgram?.description,
        maxLevels: loyaltyProgram?.maxLevels,
        burnoutType: loyaltyProgram?.burnoutType,
        lifetimeBonusDays: loyaltyProgram?.lifetimeBonusDays,
        maxRedeemPercentage: loyaltyProgram?.maxRedeemPercentage,
        hasBonusWithSale: loyaltyProgram?.hasBonusWithSale,
        ownerOrganizationId: loyaltyProgram?.ownerOrganizationId,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create tier
  @Post('tier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createTier(
    @Request() req: any,
    @Body() data: LoyaltyTierCreateDto,
  ): Promise<LoyaltyTier> {
    try {
      const { ability } = req;
      await this.loyaltyValidateRules.createLoyaltyTierValidate(
        data.loyaltyProgramId,
        ability,
      );
      return await this.createLoyaltyTierUseCase.execute(
        data.name,
        data.loyaltyProgramId,
        data.limitBenefit,
        data?.description,
        data?.upCardTierId,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Delete('tier/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async deleteTier(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const loyaltyTier =
        await this.loyaltyValidateRules.deleteLoyaltyTierValidate(id);
      return await this.deleteLoyaltyTierUseCase.execute(loyaltyTier.id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update tier
  @Patch('tier')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updateTier(@Body() data: LoyaltyTierUpdateDto): Promise<LoyaltyTier> {
    try {
      const loyaltyTier =
        await this.loyaltyValidateRules.updateLoyaltyTierValidate(
          data.loyaltyTierId,
          data?.benefitIds,
        );
      return await this.updateLoyaltyTierUseCase.execute(data, loyaltyTier);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get tiers by filter
  @Get('tiers')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getTiers(
    @Request() req: any,
    @Query() data: LoyaltyTierFilterDto,
  ): Promise<LoyaltyTierGetOneResponseDto[]> {
    try {
      const { ability, user } = req;
      let tiers: LoyaltyTier[];
      if (data.programId == '*') {
        const programs =
          await this.findMethodsLoyaltyProgramUseCase.getAllByAbility(ability);
        const programsIds = programs.map((program) => program.id);
        tiers =
          await this.findMethodsLoyaltyTierUseCase.getAllByLoyaltyProgramIds(
            programsIds,
          );
      } else {
        await this.loyaltyValidateRules.getLoyaltyProgramValidate(
          data.programId,
          ability,
          user.id,
        );
        tiers =
          await this.findMethodsLoyaltyTierUseCase.getAllByLoyaltyProgramId(
            data.programId,
            data?.onlyWithoutChildren,
          );
      }
      return await Promise.all(
        tiers.map(async (tier) => {
          const benefits =
            await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(tier.id);
          const benefitIds = benefits.map((benefit) => benefit.id);

          return {
            id: tier.id,
            name: tier.name,
            description: tier.description,
            loyaltyProgramId: tier.loyaltyProgramId,
            limitBenefit: tier.limitBenefit,
            upCardTierId: tier.upCardTierId,
            benefitIds: benefitIds,
          };
        }),
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get tier by id
  @Get('tier/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getTier(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyTierGetOneResponseDto> {
    try {
      const loyaltyTier =
        await this.loyaltyValidateRules.getLoyaltyTierValidate(id);
      const benefits =
        await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(id);
      const benefitIds = benefits.map((benefit) => benefit.id);
      return {
        id: loyaltyTier.id,
        name: loyaltyTier.name,
        description: loyaltyTier.description,
        loyaltyProgramId: loyaltyTier.loyaltyProgramId,
        limitBenefit: loyaltyTier.limitBenefit,
        benefitIds: benefitIds,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create benefit
  @Post('benefit')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createBenefit(@Body() data: BenefitCreateDto): Promise<Benefit> {
    try {
      if (data.benefitActionTypeId) {
        await this.loyaltyValidateRules.createBenefitValidate(
          data.benefitActionTypeId,
        );
      }
      return await this.createBenefitUseCase.execute(
        data.name,
        data.bonus,
        data.type,
        data.ltyProgramId,
        data?.benefitActionTypeId,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update benefit
  @Patch('benefit')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async updateBenefit(@Body() data: BenefitUpdateDto): Promise<Benefit> {
    try {
      const benefit = await this.loyaltyValidateRules.getBenefitByIdValidate(
        data.benefitId,
      );
      return await this.updateBenefitUseCase.execute(data, benefit);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get benefit by id
  @Get('benefit/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefit(@Param('id', ParseIntPipe) id: number): Promise<Benefit> {
    try {
      return await this.loyaltyValidateRules.getBenefitByIdValidate(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all benefits
  @Get('benefits')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefits(): Promise<Benefit[]> {
    try {
      return await this.findMethodsBenefitUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create benefitAction
  @Post('benefit-action')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createBenefitAction(
    @Body() data: BenefitActionCreateDto,
  ): Promise<BenefitAction> {
    try {
      return await this.createBenefitActionUseCase.execute(
        data.name,
        data?.description,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all benefitActions
  @Get('benefit-actions')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async getBenefitActions(): Promise<BenefitAction[]> {
    try {
      return await this.findMethodsBenefitActionUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create client
  @Post('client')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createClient(
    @Request() req: any,
    @Body() data: ClientCreateDto,
  ): Promise<ClientFullResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.createClientValidate(
        data.phone,
        ability,
        data?.cardId,
        data.tagIds || [],
        data?.devNumber,
        data?.number,
      );
      return await this.createClientUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update client
  @Patch('client')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async updateClient(
    @Request() req: any,
    @Body() data: ClientUpdateDto,
  ): Promise<ClientFullResponseDto> {
    try {
      const { ability } = req;

      const client = await this.loyaltyValidateRules.updateClientValidate(
        data.clientId,
        ability,
        data?.cardId,
        data?.tagIds || [],
      );
      return await this.updateClientUseCase.execute(data, client);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get clients by filter
  @Get('clients')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getClient(
    @Request() req: any,
    @Query() data: ClientFilterDto,
  ): Promise<ClientPaginatedResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.getClientsValidate(
        data.organizationId,
        user.id,
      );

      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.findByFilterClientUseCase.execute({
        ...data,
        skip,
        take,
      });
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get client by id
  @Get('client/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(201)
  async getClientById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientFullResponseDto> {
    try {
      const { ability } = req;

      const client = await this.loyaltyValidateRules.getClientByIdValidate(
        id,
        ability,
      );

      const tags = await this.findMethodsTagUseCase.getAllByClientId(client.id);
      const card = await this.findMethodsCardUseCase.getByClientId(client.id);

      return {
        id: client.id,
        name: client.name,
        birthday: client.birthday,
        phone: client.phone,
        email: client?.email,
        gender: client?.gender,
        status: client.status,
        contractType: client.contractType,
        comment: client?.comment,
        refreshTokenId: client?.refreshTokenId,
        placementId: client?.placementId,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        tags: tags.map((tag) => tag.getProps()),
        card: card
          ? {
              id: card.id,
              balance: card.balance,
              mobileUserId: card.mobileUserId,
              devNumber: card.devNumber,
              number: card.number,
              monthlyLimit: card?.monthlyLimit,
              createdAt: card.createdAt,
              updatedAt: card.updatedAt,
            }
          : null,
      };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get benefits card
  @Get('card/benefits/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async benefitCard(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardBenefitDataDto> {
    try {
      const card = await this.loyaltyValidateRules.cardBenefitValidate(id);
      return await this.getBenefitsCardUseCase.execute(card);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Create tag
  @Post('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createTag(@Body() data: TagCreateDto): Promise<any> {
    try {
      await this.loyaltyValidateRules.createTagValidate(data.name);
      return await this.createTagUseCase.execute(data.name, data.color);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Get all tags
  @Get('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getAllTags(): Promise<any> {
    try {
      return await this.findMethodsTagUseCase.getAll();
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Delete tags
  @Delete('tag/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(200)
  async deleteTags(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const tag = await this.loyaltyValidateRules.deleteTagValidate(id);
      return await this.deleteTagUseCase.execute(tag);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Get all cards
  @Get('cards')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getAllCard(@Query() data: CardsFilterDto): Promise<Card[]> {
    try {
      return await this.findMethodsCardUseCase.getAll(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('user-key-stats')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getUserKeyStats(
    @Query() data: ClientKeyStatsDto,
    @Request() req: any,
  ): Promise<UserKeyStatsResponseDto> {
    try {
      const { ability } = req;
      await this.loyaltyValidateRules.getClientByIdValidate(
        data.clientId,
        ability,
      );
      return await this.findMethodsCardUseCase.getUserKeyStatsByOrganization(
        data,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('client-loyalty-stats')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getClientLoyaltyStats(
    @Query() data: ClientLoyaltyStatsDto,
    @Request() req: any,
  ): Promise<ClientLoyaltyStatsResponseDto> {
    try {
      const { ability } = req;
      await this.loyaltyValidateRules.getClientByIdValidate(
        data.clientId,
        ability,
      );
      return await this.findMethodsCardUseCase.getClientLoyaltyStats(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('import-cards')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async importCards(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: ImportCardsDto,
  ): Promise<ImportCardsResponseDto> {
    try {
      console.log('Import cards endpoint called with:', {
        hasFile: !!file,
        fileInfo: file
          ? {
              filename: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              fieldname: file.fieldname,
              encoding: file.encoding,
              bufferLength: file.buffer?.length,
              bufferType: typeof file.buffer,
              bufferIsArray: Array.isArray(file.buffer),
              bufferIsBuffer: Buffer.isBuffer(file.buffer),
            }
          : null,
        organizationId: data.organizationId,
        bodyData: data,
      });

      const validatedFile =
        await this.loyaltyValidateRules.validateExcelCsvFileValidate(file);

      const cardsData =
        await this.fileParserService.parseCardImportFile(validatedFile);

      if (cardsData.length === 0) {
        throw new CustomHttpException({
          message: 'No valid card data found in the file',
          code: HttpStatus.BAD_REQUEST,
        });
      }

      return await this.cardImportUseCase.execute(
        data.organizationId,
        data.corporateClientId,
        data.tierId,
        cardsData,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('corporate-clients')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getCorporateClients(
    @Request() req: any,
    @Query() data: CorporateClientsFilterDto,
  ): Promise<CorporateClientsPaginatedResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getCorporateClientsValidate(
        data.organizationId,
        ability,
      );

      return await this.corporateFindByFilterUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('corporate-clients/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getCorporateClientById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CorporateClientResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.getCorporateClientByIdValidate(
        id,
        user.id,
      );

      return await this.corporateGetByIdUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('corporate-clients')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createCorporateClient(
    @Request() req: any,
    @Body() data: CorporateClientCreateDto,
  ): Promise<CorporateClientResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.createCorporateClientValidate(
        data.organizationId,
        user.id,
      );

      return await this.createCorporateClientUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Put('corporate-clients/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async updateCorporateClient(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CorporateClientUpdateDto,
  ): Promise<CorporateClientResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.updateCorporateClientValidate(
        id,
        user.id,
      );

      return await this.updateCorporateClientUseCase.execute(id, data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('corporate-clients/:id/stats')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getCorporateClientStatsById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<CorporateClientStatsResponseDto> {
    try {
      const { user } = req;
      await this.loyaltyValidateRules.getCorporateClientByIdValidate(
        id,
        user.id,
      );
      return await this.corporateGetStatsByIdUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('corporate-clients/:id/cards')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getCorporateCards(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: CorporateCardsFilterDto,
  ): Promise<CorporateCardsPaginatedResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.getCorporateClientByIdValidate(
        id,
        user.id,
      );

      return await this.corporateGetCardsUseCase.execute(id, data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('corporate-clients/:id/cards/operations')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getCorporateCardsOperations(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() data: CorporateCardsOperationsFilterDto,
  ): Promise<CorporateCardsOperationsPaginatedResponseDto> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.getCorporateClientByIdValidate(
        id,
        user.id,
      );

      return await this.corporateGetCardsOperationsUseCase.execute(id, data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Marketologist or Manager Only
  @Get('marketing-campaigns')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getMarketingCampaigns(
    @Request() req: any,
    @Query() filter: MarketingCampaignsFilterDto,
  ): Promise<MarketingCampaignsPaginatedResponseDto> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.validateUserBelongsToOrganization(
        user.id,
        filter.organizationId,
      );

      // TODO: fix validation
      await this.loyaltyValidateRules.getMarketingCampaignsValidate(
        ability,
        filter.organizationId,
      );

      return await this.findMethodsMarketingCampaignUseCase.getAllByOrganizationIdPaginated(
        filter,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('marketing-campaigns/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getMarketingCampaignById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MarketingCampaignResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        id,
        ability,
      );

      return await this.findMethodsMarketingCampaignUseCase.getOneById(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('marketing-campaigns/:id/conditions')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getMarketingCampaignConditions(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MarketingCampaignConditionsResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        id,
        ability,
      );

      return await this.findMethodsMarketingCampaignUseCase.getConditionsByCampaignId(
        id,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('marketing-campaigns/:id/conditions')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createMarketingCampaignCondition(
    @Request() req: any,
    @Param('id', ParseIntPipe) campaignId: number,
    @Body() data: CreateMarketingCampaignConditionDto,
  ): Promise<MarketingCampaignConditionResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        campaignId,
        ability,
      );

      return await this.createMarketingCampaignConditionUseCase.execute(
        campaignId,
        data,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Delete('marketing-campaigns/:id/conditions/:order')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async deleteMarketingCampaignCondition(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Param('order', ParseIntPipe) order: number,
  ): Promise<DeleteResponseDto> {
    try {
      const { ability } = req;

      const condition = await this.prisma.marketingCampaignCondition.findFirst({
        where: { id },
        select: { campaignId: true },
      });

      if (!condition) {
        throw new LoyaltyException(
          404,
          'Marketing campaign condition not found',
        );
      }

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        condition.campaignId,
        ability,
      );

      await this.deleteMarketingCampaignConditionUseCase.execute(id, order);

      return { message: 'Condition deleted successfully' };
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Put('marketing-campaigns/:id/mobile-display')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async upsertMarketingCampaignMobileDisplay(
    @Request() req: any,
    @Param('id', ParseIntPipe) campaignId: number,
    @Body() data: UpsertMarketingCampaignMobileDisplayDto,
  ): Promise<MarketingCampaignMobileDisplayResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        campaignId,
        ability,
      );

      return await this.upsertMarketingCampaignMobileDisplayUseCase.execute(
        campaignId,
        data,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('marketing-campaigns/:id/mobile-display')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getMarketingCampaignMobileDisplay(
    @Request() req: any,
    @Param('id', ParseIntPipe) campaignId: number,
  ): Promise<MarketingCampaignMobileDisplayResponseDto | null> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.getMarketingCampaignByIdValidate(
        campaignId,
        ability,
      );

      return await this.findMethodsMarketingCampaignUseCase.getMobileDisplayByCampaignId(
        campaignId,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('marketing-campaign/create')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createMarketingCampaign(
    @Request() req: any,
    @Body() data: MarketingCampaignCreateDto,
  ): Promise<MarketingCampaignResponseDto> {
    try {
      const { user, ability } = req;

      await this.loyaltyValidateRules.createMarketingCampaignValidate(
        {
          ltyProgramParticipantId: data.ltyProgramParticipantId,
        },
        ability,
      );

      return await this.createMarketingCampaignUseCase.execute(data, user.id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Put('marketing-campaign/edit/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async updateMarketingCampaign(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: MarketingCampaignUpdateDto,
  ): Promise<MarketingCampaignResponseDto> {
    try {
      const { user, ability } = req;

      await this.loyaltyValidateRules.updateMarketingCampaignValidate(
        id,
        {
          ltyProgramParticipantId: data.ltyProgramParticipantId,
          posIds: data.posIds,
        },
        ability,
      );

      return await this.updateMarketingCampaignUseCase.execute(
        id,
        data,
        user.id,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('marketing-campaign/action/create')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateLoyaltyAbility())
  @HttpCode(201)
  async createMarketingCampaignAction(
    @Request() req: any,
    @Body() data: MarketingCampaignActionCreateDto,
  ): Promise<MarketingCampaignActionResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.updateMarketingCampaignValidate(
        data.campaignId,
        {},
        ability,
      );

      return await this.createMarketingCampaignActionUseCase.execute(data);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Put('marketing-campaign/action/update/:campaignId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(200)
  async updateMarketingCampaignAction(
    @Request() req: any,
    @Param('campaignId', ParseIntPipe) campaignId: number,
    @Body() data: MarketingCampaignActionUpdateDto,
  ): Promise<MarketingCampaignActionResponseDto> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.updateMarketingCampaignValidate(
        campaignId,
        {},
        ability,
      );

      return await this.updateMarketingCampaignActionUseCase.execute(
        campaignId,
        data,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Post('programs/:id/request-hub')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async requestHub(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LoyaltyProgramHubRequestDto,
  ): Promise<any> {
    try {
      const { ability } = req;

      await this.loyaltyValidateRules.requestHubValidate(id, ability);

      return await this.loyaltyProgramHubRequestUseCase.execute(
        id,
        data.comment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Put('programs/:id/approve-hub')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  @HttpCode(200)
  async approveHub(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LoyaltyProgramHubApproveDto,
  ): Promise<any> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.approveHubValidate(id, ability);

      return await this.loyaltyProgramHubApproveUseCase.execute(
        id,
        user,
        data.comment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Put('programs/:id/reject-hub')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  @HttpCode(200)
  async rejectHub(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LoyaltyProgramHubRejectDto,
  ): Promise<any> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.rejectHubValidate(id, ability);

      return await this.loyaltyProgramHubRejectUseCase.execute(
        id,
        user,
        data.comment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('hub-requests')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  async getLoyaltyHubRequests(
    @Request() req: any,
    @Query() filter: LoyaltyHubRequestsFilterDto,
  ): Promise<LoyaltyHubRequestsListResponseDto> {
    try {
      await this.loyaltyValidateRules.getHubRequestsValidate(req.ability);

      return await this.findLoyaltyHubRequestsUseCase.execute(filter);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Marketologist or Manager Only
  @Post('participant-request')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateLoyaltyAbility())
  @HttpCode(201)
  async createParticipantRequest(
    @Request() req: any,
    @Body() data: LoyaltyProgramParticipantRequestDto,
  ): Promise<any> {
    try {
      const { user } = req;

      await this.loyaltyValidateRules.createLoyaltyProgramParticipantRequestValidate(
        data.ltyProgramId,
        data.organizationId,
        user.id,
      );

      return await this.createLoyaltyProgramParticipantRequestUseCase.execute(
        data.ltyProgramId,
        data.organizationId,
        data.requestComment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Put('programs/:id/approve-participant')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  @HttpCode(200)
  async approveParticipant(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LoyaltyProgramParticipantApproveDto,
  ): Promise<any> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.approveParticipantRequestValidate(
        id,
        ability,
      );

      return await this.loyaltyProgramParticipantApproveUseCase.execute(
        id,
        user,
        data.comment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Put('programs/:id/reject-participant')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  @HttpCode(200)
  async rejectParticipant(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LoyaltyProgramParticipantRejectDto,
  ): Promise<any> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.rejectParticipantRequestValidate(
        id,
        ability,
      );

      return await this.loyaltyProgramParticipantRejectUseCase.execute(
        id,
        user,
        data.comment,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  // Super Admin only
  @Get('participant-requests')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new SuperAdminAbility())
  async getLoyaltyParticipantRequests(
    @Request() req: any,
    @Query() filter: LoyaltyParticipantRequestsFilterDto,
  ): Promise<LoyaltyParticipantRequestsListResponseDto> {
    try {
      await this.loyaltyValidateRules.getParticipantRequestsValidate(
        req.ability,
      );

      return await this.findLoyaltyParticipantRequestsUseCase.execute(filter);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('program/:id/participant-poses')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getParticipantPoses(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PosResponseDto[]> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.getLoyaltyProgramValidate(
        id,
        ability,
        user.id,
      );

      return await this.getParticipantPosesUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('program/:id/analytics')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getLoyaltyProgramAnalytics(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LoyaltyProgramAnalyticsResponseDto> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.getLoyaltyProgramValidate(
        id,
        ability,
        user.id,
      );

      return await this.getLoyaltyProgramAnalyticsUseCase.execute(id);
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('program/:id/transaction-analytics')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadLoyaltyAbility())
  @HttpCode(200)
  async getLoyaltyProgramTransactionAnalytics(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: LoyaltyProgramTransactionAnalyticsRequestDto,
  ): Promise<LoyaltyProgramTransactionAnalyticsResponseDto> {
    try {
      const { ability, user } = req;

      await this.loyaltyValidateRules.getLoyaltyProgramValidate(
        id,
        ability,
        user.id,
      );

      const request: LoyaltyProgramTransactionAnalyticsRequestDto = {
        loyaltyProgramId: id,
        period: query.period || 'lastMonth',
        startDate: query.startDate,
        endDate: query.endDate,
      };

      return await this.getLoyaltyProgramTransactionAnalyticsUseCase.execute(
        request,
      );
    } catch (e) {
      if (e instanceof LoyaltyException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
