import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { FileModule } from '@libs/file/module';
import { ClientRepositoryProvider } from './mobile-user/client/provider/client';
import { UpdateClientUseCase } from './mobile-user/client/use-cases/client-update';
import { GetByIdClientUseCase } from './mobile-user/client/use-cases/client-get-by-id';
import { UploadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-upload';
import { DownloadAvatarClientUseCase } from './mobile-user/client/use-cases/client-avatar-download';
import { TagRepositoryProvider } from '@loyalty/mobile-user/tag/provider/tag';
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
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
import { ClientMetaRepositoryProvider } from './mobile-user/client/provider/clientMeta';

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
];

const clientUseCase: Provider[] = [
  CreateClientUseCase,
  UpdateClientUseCase,
  GetByIdClientUseCase,
  UploadAvatarClientUseCase,
  DownloadAvatarClientUseCase,
  FindMethodsClientUseCase,
  FindByFilterClientUseCase,
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
];

const loyaltyTierUseCase: Provider[] = [
  CreateLoyaltyTierUseCase,
  FindMethodsLoyaltyTierUseCase,
  UpdateLoyaltyTierUseCase,
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

@Module({
  imports: [PrismaModule, FileModule],
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
    ...corporateUseCase,
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
    ...cardBonusBank,
    ...corporateUseCase,
  ],
})
export class LoyaltyCoreModule {}
