import { Module, Provider, forwardRef } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { FileModule } from '@libs/file/module';
import { HttpModule } from '@nestjs/axios';
import { PosModule } from '@infra/pos/pos.module';
import { RedisService } from '@infra/cache/redis.service';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '@infra/queue/queue.module';
import { PaymentModule } from '../../app/payment/payment.module';
import { ClientRepositoryProvider } from './mobile-user/client/provider/client';
import { UpdateClientUseCase } from './mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from './mobile-user/client/use-cases/client-get-by-id';
import { UploadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-upload';
import { DownloadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-download';
import { GetActivePromotionsForClientUseCase } from './mobile-user/client/use-cases/get-active-promotions-for-client';
import { TagRepositoryProvider } from '@loyalty/mobile-user/tag/provider/tag';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { DeleteClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-delete';
import { FindMethodsTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-find-methods';
import { CreateTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-create';
import { DeleteTagUseCase } from '@loyalty/mobile-user/tag/use-cases/tag-delete';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CreateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-create';
import { FindMethodsClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-methods';
import { FindByFilterClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-find-by-filter';
import { UpdateCardUseCase } from '@loyalty/mobile-user/card/use-case/card-update';
import { CardImportUseCase } from '@loyalty/mobile-user/card/use-case/card-import';
import { LoyaltyProgramRepositoryProvider } from '@loyalty/loyalty/loyaltyProgram/provider/loyaltyProgram';
import { LoyaltyTierRepositoryProvider } from '@loyalty/loyalty/loyaltyTier/provider/loyaltyTier';
import { BenefitActionRepositoryProvider } from '@loyalty/loyalty/benefit/benefitAction/provider/benefitAction';
import { BenefitRepositoryProvider } from '@loyalty/loyalty/benefit/benefit/provider/benefit';
import { CreateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-create';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { CreateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-create';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { UpdateLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-update';
import { DeleteLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-delete';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';
import { CreateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-create';
import { CardRepositoryProvider } from '@loyalty/mobile-user/card/provider/card';
import { CardBonusBankProvider } from '@loyalty/mobile-user/bonus/cardBonusBank/provider/cardBonusBank';
import { CreateCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-create';
import { FindMethodsCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-find-methods';
import { CardBonusOperTypeProvider } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/provider/cardBonusOperType';
import { FindMethodsCardBonusOperTypeUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/use-case/cardBonusOperType-find-methods';
import { CardBonusOperProvider } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/provider/cardBonusOper';
import { FindMethodsCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-find-methods';
import { CreateBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-create';
import { FindMethodsBenefitActionUseCase } from '@loyalty/loyalty/benefit/benefitAction/use-case/benefitAction-find-methods';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { ExpirationCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-expiration';
import { OrderProvider } from '@loyalty/order/provider/order';
import { CreateOrderUseCase } from '@loyalty/order/use-cases/order-create';
import { UpdateOrderUseCase } from '@loyalty/order/use-cases/order-update';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { UpdateBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-update';
import { GetBenefitsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-get-benefits';
import { UpdateLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-update';
import { UpdateBonusRedemptionRulesUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-update-bonus-redemption-rules';
import { OrderGetBalanceForDeviceUseCase } from '@loyalty/order/use-cases/order-get-balance-for-device';
import { OrderOperForDeviceUseCase } from '@loyalty/order/use-cases/order-oper-for-device';
import { CorporateRepositoryProvider } from '@loyalty/mobile-user/corporate/provider/corporate';
import { CorporateFindByFilterUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-find-by-filter';
import { CorporateGetByIdUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-by-id';
import { CorporateGetStatsByIdUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-stats-by-id';
import { CorporateGetCardsUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-cards';
import { CorporateGetCardsOperationsUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-get-cards-operations';
import { CreateCorporateClientUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-create';
import { UpdateCorporateClientUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-update';
import { FindMethodsCorporateUseCase } from '@loyalty/mobile-user/corporate/use-cases/corporate-find-methods';
import { CreateMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-create';
import { UpdateMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-update';
import { FindMethodsMarketingCampaignUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-find-methods';
import { MarketingCampaignStatusHandlerUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-status-handler';
import { CreateMarketingCampaignConditionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-condition-create';
import { DeleteMarketingCampaignConditionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-condition-delete';
import { CreateMarketingCampaignActionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-action-create';
import { UpdateMarketingCampaignActionUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-action-update';
import { UpsertMarketingCampaignMobileDisplayUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-mobile-display-upsert';
import { CreatePromocodeUseCase } from '@loyalty/marketing-campaign/use-cases/promocode-create';
import { MarketingCampaignRepositoryProvider } from '@loyalty/marketing-campaign/provider/marketing-campaign';
import { PromoCodeRepositoryProvider } from '@loyalty/marketing-campaign/provider/promo-code.repository';
import { ClientMetaRepositoryProvider } from './mobile-user/client/provider/clientMeta';
import { FindMethodsOrderUseCase } from '@loyalty/order/use-cases/order-find-methods';
import { RegisterPaymentUseCase } from '@loyalty/order/use-cases/register-payment.use-case';
import { LoyaltyTierHistRepositoryProvider } from '@loyalty/loyalty/loyaltyTierHist/provider/loyaltyTierHist';
import { CreateLoyaltyTierHistUseCase } from '@loyalty/loyalty/loyaltyTierHist/use-case/loyaltyTierHist-create';
import { FindMethodsLoyaltyTierHistUseCase } from '@loyalty/loyalty/loyaltyTierHist/use-case/loyaltyTierHist-find-methods';
import { UpdateHandlerLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-update-handler';
import { LoyaltyProgramHubRequestUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-request';
import { LoyaltyProgramHubApproveUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-approve';
import { LoyaltyProgramHubRejectUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-hub-reject';
import { FindLoyaltyHubRequestsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-find-hub-requests';
import { LoyaltyProgramHubRequestRepositoryProvider } from '@loyalty/loyalty/loyaltyProgram/provider/loyalty-program-hub-request';
import { LoyaltyProgramParticipantRequestRepositoryProvider } from '@loyalty/loyalty/loyaltyProgram/provider/loyalty-program-participant-request';
import { CreateLoyaltyProgramParticipantRequestUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-request';
import { LoyaltyProgramParticipantApproveUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-approve';
import { LoyaltyProgramParticipantRejectUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-participant-reject';
import { FindLoyaltyParticipantRequestsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-find-participant-requests';
import { FindParticipantRequestByIdUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-find-participant-request-by-id';
import { GetParticipantPosesUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-participant-poses';
import { GetLoyaltyProgramAnalyticsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-analytics';
import { GetLoyaltyProgramTransactionAnalyticsUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-transaction-analytics';
import { PublishLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-publish';
import { UnpublishLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-unpublish';
import { CreateMobileOrderUseCase } from './mobile-user/order/use-cases/mobile-order-create';
import { GetMobileOrderByIdUseCase } from './mobile-user/order/use-cases/mobile-order-get-by-id';
import { UpdateMobileOrderUseCase } from './mobile-user/order/use-cases/mobile-order-update';
import { GetMobileOrderByTransactionIdUseCase } from './mobile-user/order/use-cases/mobile-order-get-by-transaction-id';
import { PromoCodeService } from './mobile-user/order/use-cases/promo-code-service';
import { ITariffRepository } from './mobile-user/order/interface/tariff';
import { TariffRepository } from './mobile-user/order/repository/tariff';
import { StartPosUseCase } from './mobile-user/order/use-cases/start-pos.use-case';
import { StartPosProcess } from '@infra/handler/pos-process/consumer/pos-process.consumer';
import { CarWashLaunchUseCase } from './mobile-user/order/use-cases/car-wash-launch.use-case';
import { CheckCarWashStartedUseCase } from './mobile-user/order/use-cases/check-car-wash-started.use-case';
import {
  OrderValidationService,
  CashbackCalculationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
} from '@loyalty/order/domain/services';

const repositories: Provider[] = [
  ClientRepositoryProvider,
  ClientMetaRepositoryProvider,
  TagRepositoryProvider,
  CardRepositoryProvider,
  LoyaltyProgramRepositoryProvider,
  LoyaltyTierRepositoryProvider,
  BenefitActionRepositoryProvider,
  BenefitRepositoryProvider,
  CardBonusBankProvider,
  CardBonusOperTypeProvider,
  CardBonusOperProvider,
  OrderProvider,
  CorporateRepositoryProvider,
  MarketingCampaignRepositoryProvider,
  PromoCodeRepositoryProvider,
  LoyaltyTierHistRepositoryProvider,
  LoyaltyProgramHubRequestRepositoryProvider,
  LoyaltyProgramParticipantRequestRepositoryProvider,
  { provide: ITariffRepository, useClass: TariffRepository },
];

const clientUseCase: Provider[] = [
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
  GetByIdClientUseCase,
  UploadAvatarClientUseCase,
  DownloadAvatarClientUseCase,
  FindMethodsClientUseCase,
  FindByFilterClientUseCase,
  GetActivePromotionsForClientUseCase,
];

const tagUseCase: Provider[] = [
  CreateTagUseCase,
  DeleteTagUseCase,
  FindMethodsTagUseCase,
];

const cardUseCase: Provider[] = [
  CreateCardUseCase,
  UpdateCardUseCase,
  FindMethodsCardUseCase,
  GetBenefitsCardUseCase,
  CardImportUseCase,
];

const loyaltyProgramUseCase: Provider[] = [
  CreateLoyaltyProgramUseCase,
  FindMethodsLoyaltyProgramUseCase,
  UpdateLoyaltyProgramUseCase,
  UpdateBonusRedemptionRulesUseCase,
  LoyaltyProgramHubRequestUseCase,
  LoyaltyProgramHubApproveUseCase,
  LoyaltyProgramHubRejectUseCase,
  FindLoyaltyHubRequestsUseCase,
  CreateLoyaltyProgramParticipantRequestUseCase,
  LoyaltyProgramParticipantApproveUseCase,
  LoyaltyProgramParticipantRejectUseCase,
  FindLoyaltyParticipantRequestsUseCase,
  FindParticipantRequestByIdUseCase,
  GetParticipantPosesUseCase,
  GetLoyaltyProgramAnalyticsUseCase,
  GetLoyaltyProgramTransactionAnalyticsUseCase,
  PublishLoyaltyProgramUseCase,
  UnpublishLoyaltyProgramUseCase,
];

const loyaltyTierUseCase: Provider[] = [
  CreateLoyaltyTierUseCase,
  FindMethodsLoyaltyTierUseCase,
  UpdateLoyaltyTierUseCase,
  UpdateHandlerLoyaltyTierUseCase,
  DeleteLoyaltyTierUseCase,
];

const loyaltyTierHistUseCase: Provider[] = [
  CreateLoyaltyTierHistUseCase,
  FindMethodsLoyaltyTierHistUseCase,
];

const benefitUseCase: Provider[] = [
  CreateBenefitUseCase,
  FindMethodsBenefitUseCase,
  UpdateBenefitUseCase,
];

const benefitActionUseCase: Provider[] = [
  CreateBenefitActionUseCase,
  FindMethodsBenefitActionUseCase,
];

const cardBonusBank: Provider[] = [
  CreateCardBonusBankUseCase,
  FindMethodsCardBonusBankUseCase,
  ExpirationCardBonusBankUseCase,
];

const cardBonusOper: Provider[] = [
  CreateCardBonusOperUseCase,
  FindMethodsCardBonusOperUseCase,
];

const cardBonusOperType: Provider[] = [FindMethodsCardBonusOperTypeUseCase];

const orderUseCase: Provider[] = [
  CreateOrderUseCase,
  UpdateOrderUseCase,
  HandlerOrderUseCase,
  OrderGetBalanceForDeviceUseCase,
  OrderOperForDeviceUseCase,
  FindMethodsOrderUseCase,
  RegisterPaymentUseCase,
];

const mobileOrderUseCase: Provider[] = [
  CreateMobileOrderUseCase,
  GetMobileOrderByIdUseCase,
  UpdateMobileOrderUseCase,
  GetMobileOrderByTransactionIdUseCase,
  PromoCodeService,
  StartPosUseCase,
  CarWashLaunchUseCase,
  CheckCarWashStartedUseCase,
];

const orderDomainServices: Provider[] = [
  OrderValidationService,
  CashbackCalculationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
];

const corporateUseCase: Provider[] = [
  CorporateFindByFilterUseCase,
  CorporateGetByIdUseCase,
  CorporateGetStatsByIdUseCase,
  CorporateGetCardsUseCase,
  CorporateGetCardsOperationsUseCase,
  CreateCorporateClientUseCase,
  UpdateCorporateClientUseCase,
  FindMethodsCorporateUseCase,
];

const marketingCampaignUseCase: Provider[] = [
  CreateMarketingCampaignUseCase,
  UpdateMarketingCampaignUseCase,
  FindMethodsMarketingCampaignUseCase,
  MarketingCampaignStatusHandlerUseCase,
  CreateMarketingCampaignConditionUseCase,
  DeleteMarketingCampaignConditionUseCase,
  UpsertMarketingCampaignMobileDisplayUseCase,
  CreateMarketingCampaignActionUseCase,
  UpdateMarketingCampaignActionUseCase,
  CreatePromocodeUseCase,
];

const redisProviders: Provider[] = [RedisService];

@Module({
  imports: [
    PrismaModule,
    FileModule,
    HttpModule,
    BusinessCoreModule,
    PosModule,
    QueueModule,
    forwardRef(() => PaymentModule),
    BullModule.registerQueue(
      {
        configKey: 'worker',
        name: 'pos-process',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
        },
      },
      {
        configKey: 'worker',
        name: 'order-finished',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 1,
        },
      },
      {
        configKey: 'worker',
        name: 'car-wash-launch',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
        },
      },
      {
        configKey: 'worker',
        name: 'check-car-wash-started',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      },
    ),
  ],
  providers: [
    ...repositories,
    ...clientUseCase,
    ...tagUseCase,
    ...cardUseCase,
    ...loyaltyProgramUseCase,
    ...loyaltyTierUseCase,
    ...benefitUseCase,
    ...benefitActionUseCase,
    ...cardBonusBank,
    ...cardBonusOper,
    ...cardBonusOperType,
    ...orderUseCase,
    ...mobileOrderUseCase,
    ...corporateUseCase,
    ...marketingCampaignUseCase,
    ...loyaltyTierHistUseCase,
    ...orderDomainServices,
    ...redisProviders,
    StartPosProcess,
  ],
  exports: [
    ...repositories,
    ...clientUseCase,
    ...tagUseCase,
    ...cardUseCase,
    ...loyaltyProgramUseCase,
    ...loyaltyTierUseCase,
    ...benefitUseCase,
    ...benefitActionUseCase,
    ...cardBonusOper,
    ...orderUseCase,
    ...mobileOrderUseCase,
    ...cardBonusBank,
    ...corporateUseCase,
    ...marketingCampaignUseCase,
  ],
})
export class LoyaltyCoreModule {}
