/**
 * Test Suite for Marketing Campaign Rewards Queue Job
 * 
 * This script tests:
 * 1. Queue job addition logic in CreateMobileOrderUseCase
 * 2. Queue job execution in ApplyMarketingCampaignRewardsUseCase
 * 
 * Part 1: Queue Job Addition Tests
 * - No discount, no promocode - Queue job SHOULD be added
 * - Discount applied (activation window) - Queue job SHOULD NOT be added
 * - Discount applied (transactional campaign) - Queue job SHOULD NOT be added
 * - Promocode used - Queue job SHOULD NOT be added
 * - Both discount and promocode - Queue job SHOULD NOT be added
 * - Promocode provided but discount is 0 - Queue job SHOULD NOT be added
 * 
 * Part 2: Queue Job Execution Tests (BEHAVIORAL campaigns only)
 * - BEHAVIORAL campaign with CASHBACK_BOOST activation window - Reward SHOULD be applied
 * - BEHAVIORAL campaign with GIFT_POINTS activation window - Reward SHOULD be applied
 * - No activation window - No reward SHOULD be applied
 * - Multiple activation windows - Best reward SHOULD be selected
 * - Usage records SHOULD be created correctly
 * 
 * Run with: npx ts-node -r tsconfig-paths/register scripts/test-marketing-campaign-rewards-queue.ts
 * 
 * ⚠️  WARNING: This script creates test data in your database. Use in a test environment only!
 */

import { PrismaClient } from '@prisma/client';
import {
  MarketingCampaignStatus,
  CampaignExecutionType,
  MarketingCampaignActionType,
  DiscountType,
  OrderStatus,
  ActivationWindowStatus,
  CampaignRedemptionType,
} from '@prisma/client';
import {
  CampaignConditionType,
  ConditionOperator,
} from '../src/core/loyalty-core/marketing-campaign/domain/enums/condition-type.enum';

import { PrismaService } from '../src/infra/database/prisma/prisma.service';
import { CreateMobileOrderUseCase } from '../src/core/loyalty-core/mobile-user/order/use-cases/mobile-order-create';
import { OrderRepository } from '../src/core/loyalty-core/order/repository/order';
import { FindMethodsCardUseCase } from '../src/core/loyalty-core/mobile-user/card/use-case/card-find-methods';
import { PromoCodeService } from '../src/core/loyalty-core/mobile-user/order/use-cases/promo-code-service';
import { ActivationWindowRepository } from '../src/core/loyalty-core/mobile-user/order/repository/activation-window.repository';
import { DiscountCalculationService } from '../src/core/loyalty-core/order/domain/services/discount-calculation.service';
import { TariffRepository } from '../src/core/loyalty-core/mobile-user/order/repository/tariff';
import { CardRepository } from '../src/core/loyalty-core/mobile-user/card/repository/card';
import { PromoCodeRepository } from '../src/core/loyalty-core/marketing-campaign/repository/promo-code.repository';
import {
  OrderValidationService,
  CashbackCalculationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
} from '../src/core/loyalty-core/order/domain/services';
import { MarketingCampaignDiscountService } from '../src/core/loyalty-core/mobile-user/order/use-cases/marketing-campaign-discount.service';
import { IPosService } from '../src/infra/pos/interface/pos.interface';
import { IFlowProducer } from '../src/core/loyalty-core/order/interface/flow-producer.interface';
import { ApplyMarketingCampaignRewardsUseCase } from '../src/core/loyalty-core/mobile-user/order/use-cases/apply-marketing-campaign-rewards.use-case';
import { MarketingCampaignRewardService } from '../src/core/loyalty-core/mobile-user/order/use-cases/marketing-campaign-reward.service';
import { CreateCardBonusOperUseCase } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { CardBonusOperRepository } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusOper/cardBonusOper/repository/cardBonusOper';
import { FindMethodsCardBonusOperTypeUseCase } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusOper/cardBonusOperType/use-case/cardBonusOperType-find-methods';
import { CardBonusOperTypeRepository } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusOper/cardBonusOperType/repository/cardBonusOperType';
import { CreateCardBonusBankUseCase } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-create';
import { CardBonusBankRepository } from '../src/core/loyalty-core/mobile-user/bonus/cardBonusBank/repository/cardBonusBank';
import { FindMethodsLoyaltyProgramUseCase } from '../src/core/loyalty-core/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';
import { LoyaltyProgramRepository } from '../src/core/loyalty-core/loyalty/loyaltyProgram/repository/loyaltyProgram';

const prisma = new PrismaClient();
const prismaService = new PrismaService();

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];
const flowProducerCalls: Array<{ name: string; queueName: string; data: any }> = [];

/**
 * Mock FlowProducer that tracks calls
 */
const mockFlowProducer: IFlowProducer = {
  add: async (config: any) => {
    flowProducerCalls.push({
      name: config.name,
      queueName: config.queueName,
      data: config.data,
    });
  },
};

/**
 * Helper: Create test infrastructure
 */
async function createTestInfrastructure() {
  const adminUser = await prisma.user.findFirst();

  if (!adminUser) {
    throw new Error('No admin user found. Please seed the database first.');
  }

  // Create a unique organization for this test to avoid conflicts with existing campaigns
  const timestamp = Date.now();
  const organization = await prisma.organization.create({
    data: {
      name: `Test Org ${timestamp}`,
      slug: `test-org-${timestamp}`,
      organizationStatus: 'ACTIVE',
      organizationType: 'LegalEntity',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const program = await prisma.lTYProgram.create({
    data: {
      name: 'Test Program',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  const programParticipant = await prisma.lTYProgramParticipant.create({
    data: {
      organizationId: organization.id,
      ltyProgramId: program.id,
      status: 'ACTIVE',
    },
  });

  const user = await prisma.lTYUser.create({
    data: {
      phone: `+123456789${Date.now()}`,
      name: 'Test User',
    },
  });

  const card = await prisma.lTYCard.create({
    data: {
      clientId: user.id,
      unqNumber: `TEST${Date.now()}`,
      number: `CARD${Date.now()}`,
      organizationId: organization.id,
    },
  });

  // Find or create POS
  let pos = await prisma.pos.findFirst({
    where: { id: 66 },
  });

  if (!pos) {
    const adminUser = await prisma.user.findFirst();
    if (!adminUser) {
      throw new Error('No admin user found. Please seed the database first.');
    }

    pos = await prisma.pos.create({
      data: {
        name: `Test POS ${Date.now()}`,
        slug: `test-pos-${Date.now()}`,
        organizationId: organization.id,
        timezone: 3,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: adminUser.id,
        updateById: adminUser.id,
      },
    });
  }

  // Find or create CarWashPos
  let carWashPos = await prisma.carWashPos.findFirst({
    where: { posId: pos.id },
  });

  if (!carWashPos) {
    carWashPos = await prisma.carWashPos.create({
      data: {
        name: `Test CarWash ${Date.now()}`,
        slug: `test-carwash-${Date.now()}`,
        posId: pos.id,
      },
    });
  }

  const deviceType = await prisma.carWashDeviceType.findFirst();
  if (!deviceType) {
    throw new Error('CarWashDeviceType not found. Please create a device type first.');
  }

  const device = await prisma.carWashDevice.create({
    data: {
      name: `Test Device ${Date.now()}`,
      carWashDeviceMetaData: '{}',
      status: 'ACTIVE',
      ipAddress: '127.0.0.1',
      carWashDeviceTypeId: deviceType.id,
      carWashPosId: carWashPos.id,
    },
  });

  return {
    adminUser,
    organization,
    program,
    programParticipant,
    user,
    card,
    pos,
    carWashPos,
    device,
  };
}

/**
 * Helper: Create use case instance with mocked flow producer
 */
function createUseCaseInstance() {
  const mockPosService: IPosService = {
    ping: async () => ({ status: 'Available' }),
  } as any;

  const orderValidationService = new OrderValidationService(mockPosService);
  const cashbackCalculationService = new CashbackCalculationService();
  const orderStatusDeterminationService = new OrderStatusDeterminationService();
  const discountCalculationService = new DiscountCalculationService();

  const orderRepository = new OrderRepository(prismaService);
  const freeVacuumValidationService = new FreeVacuumValidationService(orderRepository);

  const activationWindowRepository = new ActivationWindowRepository(prismaService);
  const tariffRepository = new TariffRepository(prismaService);
  const cardRepository = new CardRepository(prismaService);
  const promoCodeRepository = new PromoCodeRepository(prismaService);

  const findMethodsCardUseCase = new FindMethodsCardUseCase(cardRepository);
  const promoCodeService = new PromoCodeService(promoCodeRepository);
  const marketingCampaignDiscountService = new MarketingCampaignDiscountService(
    prismaService,
    discountCalculationService,
  );

  // Use the global mockFlowProducer that tracks calls
  const useCase = new CreateMobileOrderUseCase(
    orderRepository,
    findMethodsCardUseCase,
    promoCodeService,
    activationWindowRepository,
    discountCalculationService,
    tariffRepository,
    orderValidationService,
    cashbackCalculationService,
    freeVacuumValidationService,
    orderStatusDeterminationService,
    marketingCampaignDiscountService,
    mockFlowProducer,
  );

  return useCase;
}

/**
 * Helper: Cleanup test data
 */
async function cleanupTestData(ids: {
  userId?: number;
  cardId?: number;
  deviceId?: number;
  campaignId?: number;
  activationWindowId?: number;
  promocodeId?: number;
  orderId?: number;
}) {
  if (ids.orderId) {
    await prisma.lTYOrder.deleteMany({ where: { id: ids.orderId } }).catch(() => {});
  }
  if (ids.activationWindowId) {
    await prisma.activationWindow.deleteMany({ where: { id: ids.activationWindowId } }).catch(() => {});
  }
  if (ids.campaignId) {
    await prisma.marketingCampaign.deleteMany({ where: { id: ids.campaignId } }).catch(() => {});
  }
  if (ids.promocodeId) {
    await prisma.lTYPromocode.deleteMany({ where: { id: ids.promocodeId } }).catch(() => {});
  }
  if (ids.cardId) {
    await prisma.lTYCard.deleteMany({ where: { id: ids.cardId } }).catch(() => {});
  }
  if (ids.userId) {
    await prisma.lTYUser.deleteMany({ where: { id: ids.userId } }).catch(() => {});
  }
  if (ids.deviceId) {
    await prisma.carWashDevice.deleteMany({ where: { id: ids.deviceId } }).catch(() => {});
  }
}

/**
 * Test 1: No discount, no promocode - Queue job SHOULD be added
 */
async function testNoDiscountNoPromocode() {
  let infrastructure: any = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card } = infrastructure;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });

    orderId = result.orderId;

    const order = await prisma.lTYOrder.findUnique({ where: { id: orderId } });
    console.log(`[DEBUG Test 1] Order discount: ${order?.sumDiscount}, Order ID: ${orderId}`);
    console.log(`[DEBUG Test 1] FlowProducer calls: ${JSON.stringify(flowProducerCalls, null, 2)}`);

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    if (!queueJobAdded) {
      throw new Error(`Queue job was NOT added when it should have been. Order discount: ${order?.sumDiscount}, FlowProducer calls count: ${flowProducerCalls.length}`);
    }

    results.push({
      testName: 'Test 1: No discount, no promocode',
      passed: true,
      details: { orderId, queueJobAdded },
    });
    console.log('✅ Test 1 PASSED: Queue job added when no discount/promocode');
  } catch (error: any) {
    results.push({
      testName: 'Test 1: No discount, no promocode',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 1 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 2: Discount applied (activation window), no promocode - Queue job SHOULD NOT be added
 */
async function testDiscountActivationWindow() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Discount Campaign',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 10,
            },
          },
        },
      },
    });
    campaignId = campaign.id;

    const campaignWithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign.id },
      include: { action: true },
    });

    if (!campaignWithAction?.action) {
      throw new Error('Campaign action not found');
    }

    const activationWindow = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        actionId: campaignWithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });

    orderId = result.orderId;

    const order = await prisma.lTYOrder.findUnique({ where: { id: orderId } });
    if (!order || order.sumDiscount === 0) {
      throw new Error('Discount was not applied');
    }

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    if (queueJobAdded) {
      throw new Error('Queue job was added when it should NOT have been (discount applied)');
    }

    results.push({
      testName: 'Test 2: Discount (activation window), no promocode',
      passed: true,
      details: { orderId, discount: order.sumDiscount, queueJobAdded },
    });
    console.log('✅ Test 2 PASSED: Queue job NOT added when discount applied');
  } catch (error: any) {
    results.push({
      testName: 'Test 2: Discount (activation window), no promocode',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 2 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (activationWindowId) {
      await cleanupTestData({ activationWindowId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 3: Promocode used, no discount - Queue job SHOULD NOT be added
 */
async function testPromocodeUsed() {
  let infrastructure: any = null;
  let promocodeId: number | null = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, adminUser } = infrastructure;

    const promocode = await prisma.lTYPromocode.create({
      data: {
        code: `TEST${Date.now()}`,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 15,
        isActive: true,
        promocodeType: 'STANDALONE',
      },
    });
    promocodeId = promocode.id;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: infrastructure.carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      promoCodeId: promocode.id,
    });

    orderId = result.orderId;

    const order = await prisma.lTYOrder.findUnique({ where: { id: orderId } });
    if (!order || order.sumDiscount === 0) {
      throw new Error('Promocode discount was not applied');
    }

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    if (queueJobAdded) {
      throw new Error('Queue job was added when it should NOT have been (promocode used)');
    }

    results.push({
      testName: 'Test 3: Promocode used, no discount',
      passed: true,
      details: { orderId, discount: order.sumDiscount, queueJobAdded },
    });
    console.log('✅ Test 3 PASSED: Queue job NOT added when promocode used');
  } catch (error: any) {
    results.push({
      testName: 'Test 3: Promocode used, no discount',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 3 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (promocodeId) {
      await cleanupTestData({ promocodeId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 4: Both discount and promocode applied - Queue job SHOULD NOT be added
 */
async function testBothDiscountAndPromocode() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let promocodeId: number | null = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Discount Campaign',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 10,
            },
          },
        },
      },
    });
    campaignId = campaign.id;

    const campaignWithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign.id },
      include: { action: true },
    });

    if (!campaignWithAction?.action) {
      throw new Error('Campaign action not found');
    }

    const activationWindow = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        actionId: campaignWithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    const promocode = await prisma.lTYPromocode.create({
      data: {
        code: `TEST${Date.now()}`,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 15,
        isActive: true,
        promocodeType: 'STANDALONE',
      },
    });
    promocodeId = promocode.id;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: infrastructure.carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      promoCodeId: promocode.id,
    });

    orderId = result.orderId;

    const order = await prisma.lTYOrder.findUnique({ where: { id: orderId } });
    if (!order || order.sumDiscount === 0) {
      throw new Error('Discount was not applied');
    }

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    if (queueJobAdded) {
      throw new Error('Queue job was added when it should NOT have been (both discount and promocode applied)');
    }

    results.push({
      testName: 'Test 4: Both discount and promocode',
      passed: true,
      details: { orderId, discount: order.sumDiscount, queueJobAdded },
    });
    console.log('✅ Test 4 PASSED: Queue job NOT added when both discount and promocode applied');
  } catch (error: any) {
    results.push({
      testName: 'Test 4: Both discount and promocode',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 4 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (activationWindowId) {
      await cleanupTestData({ activationWindowId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (promocodeId) {
      await cleanupTestData({ promocodeId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 5: Promocode provided but discount is 0 - Queue job SHOULD NOT be added
 */
async function testPromocodeProvidedButNoDiscount() {
  let infrastructure: any = null;
  let promocodeId: number | null = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, adminUser } = infrastructure;

    // Create an inactive or expired promocode that won't apply
    const promocode = await prisma.lTYPromocode.create({
      data: {
        code: `TEST${Date.now()}`,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 0, // 0% discount
        isActive: true,
        promocodeType: 'STANDALONE',
      },
    });
    promocodeId = promocode.id;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: infrastructure.carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      promoCodeId: promocode.id,
    });

    orderId = result.orderId;

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    // Even though discount is 0, promocode was provided, so queue job should NOT be added
    if (queueJobAdded) {
      throw new Error('Queue job was added when it should NOT have been (promocode provided)');
    }

    results.push({
      testName: 'Test 5: Promocode provided but discount is 0',
      passed: true,
      details: { orderId, queueJobAdded },
    });
    console.log('✅ Test 5 PASSED: Queue job NOT added when promocode provided (even if discount is 0)');
  } catch (error: any) {
    results.push({
      testName: 'Test 5: Promocode provided but discount is 0',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 5 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (promocodeId) {
      await cleanupTestData({ promocodeId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 6: Transactional campaign discount applied - Queue job SHOULD NOT be added
 */
async function testTransactionalCampaignDiscount() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    flowProducerCalls.length = 0;
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Transactional Campaign',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 10,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 500,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });

    orderId = result.orderId;

    const order = await prisma.lTYOrder.findUnique({ where: { id: orderId } });
    if (!order || order.sumDiscount === 0) {
      throw new Error('Transactional campaign discount was not applied');
    }

    const queueJobAdded = flowProducerCalls.some(
      (call) => call.name === 'apply-marketing-campaign-rewards' && call.data.orderId === orderId,
    );

    if (queueJobAdded) {
      throw new Error('Queue job was added when it should NOT have been (transactional discount applied)');
    }

    results.push({
      testName: 'Test 6: Transactional campaign discount',
      passed: true,
      details: { orderId, discount: order.sumDiscount, queueJobAdded },
    });
    console.log('✅ Test 6 PASSED: Queue job NOT added when transactional discount applied');
  } catch (error: any) {
    results.push({
      testName: 'Test 6: Transactional campaign discount',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 6 FAILED:', error.message);
  } finally {
    if (orderId) {
      await cleanupTestData({ orderId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Helper: Create ApplyMarketingCampaignRewardsUseCase instance
 */
function createRewardsUseCaseInstance() {
  const orderRepository = new OrderRepository(prismaService);
  const cardRepository = new CardRepository(prismaService);
  const findMethodsCardUseCase = new FindMethodsCardUseCase(cardRepository);
  
  const cardBonusOperTypeRepository = new CardBonusOperTypeRepository(prismaService);
  const findMethodsCardBonusOperTypeUseCase = new FindMethodsCardBonusOperTypeUseCase(cardBonusOperTypeRepository);
  const cardBonusOperRepository = new CardBonusOperRepository(prismaService);
  const cardBonusBankRepository = new CardBonusBankRepository(prismaService);
  const createCardBonusBankUseCase = new CreateCardBonusBankUseCase(cardBonusBankRepository);
  const loyaltyProgramRepository = new LoyaltyProgramRepository(prismaService);
  // For test purposes, we'll create minimal mocks for these dependencies
  // In a real scenario, these would be properly instantiated
  const findMethodsOrganizationUseCase = {} as any; // Mock - not used in our tests
  const findMethodsPosUseCase = {} as any; // Mock - not used in our tests
  const findMethodsLoyaltyProgramUseCase = new FindMethodsLoyaltyProgramUseCase(
    loyaltyProgramRepository,
    findMethodsOrganizationUseCase,
    findMethodsPosUseCase,
    cardRepository,
  );
  const createCardBonusOperUseCase = new CreateCardBonusOperUseCase(
    cardBonusOperRepository,
    findMethodsCardBonusOperTypeUseCase,
    cardRepository,
    createCardBonusBankUseCase,
    findMethodsLoyaltyProgramUseCase,
  );

  const activationWindowRepository = new ActivationWindowRepository(prismaService);
  const marketingCampaignRewardService = new MarketingCampaignRewardService(prismaService);

  const useCase = new ApplyMarketingCampaignRewardsUseCase(
    orderRepository,
    findMethodsCardUseCase,
    createCardBonusOperUseCase,
    marketingCampaignRewardService,
    activationWindowRepository,
    prismaService,
  );

  return useCase;
}

/**
 * Test 7: BEHAVIORAL campaign with CASHBACK_BOOST activation window - Reward SHOULD be applied
 */
async function testBehavioralCashbackBoost() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser, pos } = infrastructure;

    // Create BEHAVIORAL campaign with CASHBACK_BOOST
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Behavioral Cashback Boost',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.CASHBACK_BOOST,
            payload: {
              multiplier: 2, // 2x cashback boost
            },
          },
        },
      },
    });
    campaignId = campaign.id;

    const campaignWithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign.id },
      include: { action: true },
    });

    if (!campaignWithAction?.action) {
      throw new Error('Campaign action not found');
    }

    // Create activation window
    const activationWindow = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        actionId: campaignWithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    // Create order without discount (so queue job will be triggered)
    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });
    orderId = result.orderId;

    // Update order to have some cashback (base cashback)
    await prisma.lTYOrder.update({
      where: { id: orderId },
      data: { sumCashback: 50 }, // Base cashback: 50
    });

    // Execute the rewards queue job
    const rewardsUseCase = createRewardsUseCaseInstance();
    await rewardsUseCase.execute(orderId);

    // Verify reward was applied
    const bonusOpers = await prisma.lTYBonusOper.findMany({
      where: {
        orderId: orderId,
        comment: { contains: `Campaign ${campaign.id}` },
      },
    });

    if (bonusOpers.length === 0) {
      throw new Error('Cashback boost reward was not applied');
    }

    // Expected: 50 * 2 = 100 (2x multiplier)
    const expectedReward = 100;
    const actualReward = bonusOpers[0].sum;
    if (actualReward !== expectedReward) {
      throw new Error(`Expected reward ${expectedReward}, got ${actualReward}`);
    }

    // Verify usage record was created
    const usage = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: orderId,
        campaignId: campaign.id,
        type: CampaignRedemptionType.CASHBACK,
      },
    });

    if (!usage) {
      throw new Error('Usage record was not created');
    }

    results.push({
      testName: 'Test 7: BEHAVIORAL CASHBACK_BOOST reward',
      passed: true,
      details: { orderId, reward: actualReward, usageCreated: !!usage },
    });
    console.log('✅ Test 7 PASSED: Cashback boost reward applied correctly');
  } catch (error: any) {
    results.push({
      testName: 'Test 7: BEHAVIORAL CASHBACK_BOOST reward',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 7 FAILED:', error.message);
  } finally {
    if (orderId) {
      await prisma.lTYBonusOper.deleteMany({ where: { orderId: orderId } }).catch(() => {});
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await cleanupTestData({ orderId });
    }
    if (activationWindowId) {
      await cleanupTestData({ activationWindowId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 8: BEHAVIORAL campaign with GIFT_POINTS activation window - Reward SHOULD be applied
 */
async function testBehavioralGiftPoints() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign with GIFT_POINTS
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Behavioral Gift Points',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.GIFT_POINTS,
            payload: {
              points: 500, // Gift 500 points
            },
          },
        },
      },
    });
    campaignId = campaign.id;

    const campaignWithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign.id },
      include: { action: true },
    });

    if (!campaignWithAction?.action) {
      throw new Error('Campaign action not found');
    }

    // Create activation window
    const activationWindow = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        actionId: campaignWithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    // Create order without discount
    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });
    orderId = result.orderId;

    // Execute the rewards queue job
    const rewardsUseCase = createRewardsUseCaseInstance();
    await rewardsUseCase.execute(orderId);

    // Verify reward was applied
    const bonusOpers = await prisma.lTYBonusOper.findMany({
      where: {
        orderId: orderId,
        comment: { contains: `Campaign ${campaign.id}` },
      },
    });

    if (bonusOpers.length === 0) {
      throw new Error('Gift points reward was not applied');
    }

    // Expected: 500 points
    const expectedReward = 500;
    const actualReward = bonusOpers[0].sum;
    if (actualReward !== expectedReward) {
      throw new Error(`Expected reward ${expectedReward}, got ${actualReward}`);
    }

    // Verify usage record was created
    const usage = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: orderId,
        campaignId: campaign.id,
        type: CampaignRedemptionType.GIFT_POINTS,
      },
    });

    if (!usage) {
      throw new Error('Usage record was not created');
    }

    results.push({
      testName: 'Test 8: BEHAVIORAL GIFT_POINTS reward',
      passed: true,
      details: { orderId, reward: actualReward, usageCreated: !!usage },
    });
    console.log('✅ Test 8 PASSED: Gift points reward applied correctly');
  } catch (error: any) {
    results.push({
      testName: 'Test 8: BEHAVIORAL GIFT_POINTS reward',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 8 FAILED:', error.message);
  } finally {
    if (orderId) {
      await prisma.lTYBonusOper.deleteMany({ where: { orderId: orderId } }).catch(() => {});
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await cleanupTestData({ orderId });
    }
    if (activationWindowId) {
      await cleanupTestData({ activationWindowId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 9: No activation window - No reward SHOULD be applied
 */
async function testNoActivationWindow() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign but DON'T create activation window
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Behavioral No Window',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.CASHBACK_BOOST,
            payload: {
              multiplier: 2,
            },
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create order without discount
    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });
    orderId = result.orderId;

    // Update order to have some cashback
    await prisma.lTYOrder.update({
      where: { id: orderId },
      data: { sumCashback: 50 },
    });

    // Execute the rewards queue job
    const rewardsUseCase = createRewardsUseCaseInstance();
    await rewardsUseCase.execute(orderId);

    // Verify NO reward was applied
    const bonusOpers = await prisma.lTYBonusOper.findMany({
      where: {
        orderId: orderId,
        comment: { contains: `Campaign ${campaign.id}` },
      },
    });

    if (bonusOpers.length > 0) {
      throw new Error('Reward was applied when it should NOT have been (no activation window)');
    }

    results.push({
      testName: 'Test 9: No activation window',
      passed: true,
      details: { orderId, rewardsApplied: bonusOpers.length },
    });
    console.log('✅ Test 9 PASSED: No reward applied when no activation window exists');
  } catch (error: any) {
    results.push({
      testName: 'Test 9: No activation window',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 9 FAILED:', error.message);
  } finally {
    if (orderId) {
      await prisma.lTYBonusOper.deleteMany({ where: { orderId: orderId } }).catch(() => {});
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await cleanupTestData({ orderId });
    }
    if (campaignId) {
      await cleanupTestData({ campaignId });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

/**
 * Test 10: Multiple activation windows - Best reward SHOULD be selected
 */
async function testMultipleActivationWindows() {
  let infrastructure: any = null;
  let campaign1Id: number | null = null;
  let campaign2Id: number | null = null;
  let activationWindow1Id: number | null = null;
  let activationWindow2Id: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, carWashPos, device, card, programParticipant, adminUser } = infrastructure;

    // Create first BEHAVIORAL campaign with smaller cashback boost
    const campaign1 = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Behavioral Campaign 1',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.CASHBACK_BOOST,
            payload: {
              multiplier: 1.5, // 1.5x boost
            },
          },
        },
      },
    });
    campaign1Id = campaign1.id;

    // Create second BEHAVIORAL campaign with larger cashback boost
    const campaign2 = await prisma.marketingCampaign.create({
      data: {
        name: 'Test Behavioral Campaign 2',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.CASHBACK_BOOST,
            payload: {
              multiplier: 3, // 3x boost (better)
            },
          },
        },
      },
    });
    campaign2Id = campaign2.id;

    const campaign1WithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign1.id },
      include: { action: true },
    });

    const campaign2WithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign2.id },
      include: { action: true },
    });

    if (!campaign1WithAction?.action || !campaign2WithAction?.action) {
      throw new Error('Campaign action not found');
    }

    // Create activation windows for both campaigns
    const activationWindow1 = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign1.id,
        actionId: campaign1WithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindow1Id = activationWindow1.id;

    const activationWindow2 = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign2.id,
        actionId: campaign2WithAction.action.id,
        startAt: new Date(Date.now() - 86400000),
        endAt: new Date(Date.now() + 86400000),
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindow2Id = activationWindow2.id;

    // Create order without discount
    const useCase = createUseCaseInstance();
    const result = await useCase.execute({
      sum: 1000,
      sumBonus: 0,
      carWashId: carWashPos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
    });
    orderId = result.orderId;

    // Update order to have some cashback
    await prisma.lTYOrder.update({
      where: { id: orderId },
      data: { sumCashback: 50 }, // Base cashback: 50
    });

    // Execute the rewards queue job
    const rewardsUseCase = createRewardsUseCaseInstance();
    await rewardsUseCase.execute(orderId);

    // Verify reward was applied (should be from campaign2 - 3x boost)
    const bonusOpers = await prisma.lTYBonusOper.findMany({
      where: {
        orderId: orderId,
        comment: { contains: 'Marketing campaign cashback boost' },
      },
    });

    if (bonusOpers.length === 0) {
      throw new Error('Cashback boost reward was not applied');
    }

    // Expected: 50 * 3 = 150 (3x multiplier from campaign2)
    const expectedReward = 150;
    const actualReward = bonusOpers[0].sum;
    if (actualReward !== expectedReward) {
      throw new Error(`Expected reward ${expectedReward} (from campaign2), got ${actualReward}`);
    }

    // Verify usage record was created for campaign2 (the best one)
    const usage = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: orderId,
        campaignId: campaign2.id,
        type: CampaignRedemptionType.CASHBACK,
      },
    });

    if (!usage) {
      throw new Error('Usage record was not created for the best campaign');
    }

    // Verify usage record was NOT created for campaign1 (the worse one)
    const usage1 = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: orderId,
        campaignId: campaign1.id,
        type: CampaignRedemptionType.CASHBACK,
      },
    });

    if (usage1) {
      throw new Error('Usage record was created for the worse campaign (should only use best)');
    }

    results.push({
      testName: 'Test 10: Multiple activation windows - best selected',
      passed: true,
      details: { orderId, reward: actualReward, bestCampaignId: campaign2.id },
    });
    console.log('✅ Test 10 PASSED: Best reward selected from multiple activation windows');
  } catch (error: any) {
    results.push({
      testName: 'Test 10: Multiple activation windows - best selected',
      passed: false,
      error: error.message,
    });
    console.log('❌ Test 10 FAILED:', error.message);
  } finally {
    if (orderId) {
      await prisma.lTYBonusOper.deleteMany({ where: { orderId: orderId } }).catch(() => {});
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await cleanupTestData({ orderId });
    }
    if (activationWindow1Id) {
      await cleanupTestData({ activationWindowId: activationWindow1Id });
    }
    if (activationWindow2Id) {
      await cleanupTestData({ activationWindowId: activationWindow2Id });
    }
    if (campaign1Id) {
      await cleanupTestData({ campaignId: campaign1Id });
    }
    if (campaign2Id) {
      await cleanupTestData({ campaignId: campaign2Id });
    }
    if (infrastructure) {
      await cleanupTestData({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        deviceId: infrastructure.device.id,
      });
    }
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('🚀 Starting Marketing Campaign Rewards Queue Job Tests...\n');
  console.log('⚠️  WARNING: This script creates test data in your database!\n');
  console.log('📋 Part 1: Queue Job Addition Tests:\n');
  console.log('   1. No discount, no promocode - Queue job SHOULD be added');
  console.log('   2. Discount (activation window) - Queue job SHOULD NOT be added');
  console.log('   3. Promocode used - Queue job SHOULD NOT be added');
  console.log('   4. Both discount and promocode - Queue job SHOULD NOT be added');
  console.log('   5. Promocode provided but discount is 0 - Queue job SHOULD NOT be added');
  console.log('   6. Transactional campaign discount - Queue job SHOULD NOT be added\n');
  console.log('📋 Part 2: Queue Job Execution Tests (BEHAVIORAL campaigns only):\n');
  console.log('   7. BEHAVIORAL CASHBACK_BOOST with activation window - Reward SHOULD be applied');
  console.log('   8. BEHAVIORAL GIFT_POINTS with activation window - Reward SHOULD be applied');
  console.log('   9. No activation window - No reward SHOULD be applied');
  console.log('  10. Multiple activation windows - Best reward SHOULD be selected\n');

  try {
    // Part 1: Queue job addition tests
    console.log('🔍 Running Part 1: Queue Job Addition Tests...\n');
    await testNoDiscountNoPromocode();
    await testDiscountActivationWindow();
    await testPromocodeUsed();
    await testBothDiscountAndPromocode();
    await testPromocodeProvidedButNoDiscount();
    await testTransactionalCampaignDiscount();

    // Part 2: Queue job execution tests
    console.log('\n🔍 Running Part 2: Queue Job Execution Tests...\n');
    await testBehavioralCashbackBoost();
    await testBehavioralGiftPoints();
    await testNoActivationWindow();
    await testMultipleActivationWindows();

    console.log('\n📊 Test Summary:');
    console.log('================');
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total: ${results.length}`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`   - ${r.testName}: ${r.error}`);
        });
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
      console.log('\n✅ Part 1 Verified:');
      console.log('   - Queue job is added only when no discount and no promocode');
      console.log('   - Queue job is NOT added when discount is applied');
      console.log('   - Queue job is NOT added when promocode is used');
      console.log('   - Queue job is NOT added when both are applied');
      console.log('\n✅ Part 2 Verified:');
      console.log('   - BEHAVIORAL campaigns with activation windows apply rewards correctly');
      console.log('   - No activation window = no reward');
      console.log('   - Best reward is selected from multiple activation windows');
      console.log('   - Usage records are created correctly');
      process.exit(0);
    }
  } catch (error: any) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

// Run tests
runAllTests();

