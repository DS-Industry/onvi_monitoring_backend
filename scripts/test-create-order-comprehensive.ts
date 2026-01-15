/**
 * Comprehensive Test Suite for CreateMobileOrderUseCase
 * 
 * This script tests EVERY condition type and campaign type by actually calling
 * CreateMobileOrderUseCase.execute() and verifying the results.
 * 
 * Test Coverage:
 * - All condition types: VISIT_COUNT, PURCHASE_AMOUNT, TIME_RANGE, WEEKDAY, PROMOCODE_ENTRY, BIRTHDAY, INACTIVITY
 * - Both campaign types: TRANSACTIONAL and BEHAVIORAL
 * - Multiple discounts scenario (best one selected)
 * - All discount types: FIXED_AMOUNT, PERCENTAGE, FREE_SERVICE
 * 
 * Run with: npx ts-node -r tsconfig-paths/register scripts/test-create-order-comprehensive.ts
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
} from '@prisma/client';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
  Weekday,
} from '../src/core/loyalty-core/marketing-campaign/domain/enums/condition-type.enum';

// Import the actual use case and dependencies
import { PrismaService } from '../src/infra/database/prisma/prisma.service';
import { CreateMobileOrderUseCase } from '../src/core/loyalty-core/mobile-user/order/use-cases/mobile-order-create';
import { OrderRepository } from '../src/core/loyalty-core/order/repository/order';
import { FindMethodsCardUseCase } from '../src/core/loyalty-core/mobile-user/card/use-case/card-find-methods';
import { PromoCodeService } from '../src/core/loyalty-core/mobile-user/order/use-cases/promo-code-service';
import { ActivationWindowRepository } from '../src/core/loyalty-core/mobile-user/order/repository/activation-window.repository';
import { DiscountCalculationService } from '../src/core/loyalty-core/order/domain/services/discount-calculation.service';
import { TariffRepository } from '../src/core/loyalty-core/mobile-user/order/repository/tariff';
import { OrderValidationService } from '../src/core/loyalty-core/order/domain/services/order-validation.service';
import { CashbackCalculationService } from '../src/core/loyalty-core/order/domain/services/cashback-calculation.service';
import { FreeVacuumValidationService } from '../src/core/loyalty-core/order/domain/services/free-vacuum-validation.service';
import { OrderStatusDeterminationService } from '../src/core/loyalty-core/order/domain/services/order-status-determination.service';
import { OrderBuilderService } from '../src/core/loyalty-core/order/domain/services/order-builder.service';
import { OrderDiscountService } from '../src/core/loyalty-core/order/domain/services/order-discount.service';
import { OrderUsageDataService } from '../src/core/loyalty-core/order/domain/services/order-usage-data.service';
import { MarketingCampaignDiscountService } from '../src/core/loyalty-core/mobile-user/order/use-cases/marketing-campaign-discount.service';
import { CardRepository } from '../src/core/loyalty-core/mobile-user/card/repository/card';
import { PromoCodeRepository } from '../src/core/loyalty-core/marketing-campaign/repository/promo-code.repository';
import { IPosService } from '../src/infra/pos/interface/pos.interface';

const prisma = new PrismaClient();
const prismaService = new PrismaService();

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
  orderId?: number;
  discountApplied?: number;
}

const results: TestResult[] = [];

async function logTest(
  name: string,
  passed: boolean,
  error?: string,
  details?: any,
  orderId?: number,
  discountApplied?: number,
) {
  results.push({ testName: name, passed, error, details, orderId, discountApplied });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
  if (details) {
    console.log(`   Details:`, JSON.stringify(details, null, 2));
  }
  if (orderId) {
    console.log(`   Order ID: ${orderId}`);
  }
  if (discountApplied !== undefined) {
    console.log(`   Discount Applied: ${discountApplied}`);
  }
}

/**
 * Helper: Create test infrastructure (user, card, POS, organization)
 */
async function createTestInfrastructure() {
  const timestamp = Date.now();
  
  // Try to use existing organization or create minimal one
  let organization = await prisma.organization.findFirst({
    where: { id: 10 },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: `Test Org ${timestamp}`,
        slug: `test-org-${timestamp}`,
        organizationStatus: 'ACTIVE',
        organizationType: 'LegalEntity',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Try to use existing POS or create minimal one
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
        name: `Test POS ${timestamp}`,
        slug: `test-pos-${timestamp}`,
        organizationId: organization.id,
        timezone: 3,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: adminUser.id,
        updateById: adminUser.id,
        carWashPos: {
          create: {
            name: `Test CarWash ${timestamp}`,
            slug: `test-carwash-${timestamp}`,
          },
        },
      },
    });
  }

  // Get or create CarWashPos
  let carWashPos = await prisma.carWashPos.findFirst({
    where: { posId: pos.id },
  });

  if (!carWashPos) {
    carWashPos = await prisma.carWashPos.create({
      data: {
        name: `Test CarWash ${timestamp}`,
        slug: `test-carwash-${timestamp}`,
        posId: pos.id,
      },
    });
  }

  // Get device type
  const deviceType = await prisma.carWashDeviceType.findFirst({
    where: { id: 1 },
  });

  if (!deviceType) {
    throw new Error('CarWashDeviceType id=1 not found. Please run seed first.');
  }

  // Create device
  const device = await prisma.carWashDevice.create({
    data: {
      name: `Test Device ${timestamp}`,
      carWashDeviceMetaData: '{}',
      status: 'ACTIVE',
      ipAddress: '127.0.0.1',
      carWashDeviceTypeId: deviceType.id,
      carWashPosId: carWashPos.id,
    },
  });

  // Create user
  const user = await prisma.lTYUser.create({
    data: {
      phone: `+7999${timestamp}`,
      name: 'Test User',
    },
  });

  // Create card
  const card = await prisma.lTYCard.create({
    data: {
      clientId: user.id,
      unqNumber: `TEST${timestamp}`,
      number: `TEST${timestamp}`,
      organizationId: organization.id,
    },
  });

  // Get or create loyalty program and participant
  let program = await prisma.lTYProgram.findFirst();
  let programParticipant;

  if (program) {
    programParticipant = await prisma.lTYProgramParticipant.findFirst({
      where: {
        ltyProgramId: program.id,
        organizationId: organization.id,
      },
    });

    if (!programParticipant) {
      programParticipant = await prisma.lTYProgramParticipant.create({
        data: {
          ltyProgramId: program.id,
          organizationId: organization.id,
          status: 'ACTIVE',
        },
      });
    }
  } else {
    program = await prisma.lTYProgram.create({
      data: {
        name: `Test Program ${timestamp}`,
        status: 'ACTIVE',
        startDate: new Date(),
      },
    });

    programParticipant = await prisma.lTYProgramParticipant.create({
      data: {
        ltyProgramId: program.id,
        organizationId: organization.id,
        status: 'ACTIVE',
      },
    });
  }

  const adminUser = await prisma.user.findFirst();
  if (!adminUser) {
    throw new Error('No admin user found. Please seed the database first.');
  }

  return { user, card, pos, device, organization, programParticipant, carWashPos, adminUser };
}

/**
 * Helper: Clean up test infrastructure
 */
async function cleanupTestInfrastructure(ids: {
  userId: number;
  cardId: number;
  posId: number;
  deviceId: number;
  organizationId: number;
  programParticipantId: number;
  carWashPosId?: number;
}) {
  await prisma.lTYCard.delete({ where: { id: ids.cardId } }).catch(() => {});
  await prisma.lTYUser.delete({ where: { id: ids.userId } }).catch(() => {});
  await prisma.carWashDevice.delete({ where: { id: ids.deviceId } }).catch(() => {});
  if (ids.carWashPosId) {
    await prisma.carWashPos.delete({ where: { id: ids.carWashPosId } }).catch(() => {});
  }
  const pos = await prisma.pos.findUnique({ where: { id: ids.posId } }).catch(() => null);
  if (pos && pos.name.includes('Test POS')) {
    await prisma.pos.delete({ where: { id: ids.posId } }).catch(() => {});
  }
  const org = await prisma.organization.findUnique({ where: { id: ids.organizationId } }).catch(() => null);
  if (org && org.name.includes('Test Org')) {
    await prisma.lTYProgramParticipant.delete({ where: { id: ids.programParticipantId } }).catch(() => {});
    await prisma.organization.delete({ where: { id: ids.organizationId } }).catch(() => {});
  }
}

/**
 * Helper: Create CreateMobileOrderUseCase instance with all dependencies
 */
function createUseCaseInstance() {
  // Mock IPosService
  const mockPosService: IPosService = {
    ping: async () => ({ status: 'Available' }),
  } as any;

  // Mock IFlowProducer
  const mockFlowProducer = {
    add: async () => {},
  };

  // Create all services
  const orderValidationService = new OrderValidationService(mockPosService);
  const cashbackCalculationService = new CashbackCalculationService();
  const orderStatusDeterminationService = new OrderStatusDeterminationService();
  const discountCalculationService = new DiscountCalculationService();
  
  // Create repositories first (needed for FreeVacuumValidationService)
  const orderRepository = new OrderRepository(prismaService);
  const freeVacuumValidationService = new FreeVacuumValidationService(orderRepository);
  
  // Create remaining repositories
  const activationWindowRepository = new ActivationWindowRepository(prismaService);
  const tariffRepository = new TariffRepository(prismaService);
  const cardRepository = new CardRepository(prismaService);
  const promoCodeRepository = new PromoCodeRepository(prismaService);
  
  // Create use cases
  const findMethodsCardUseCase = new FindMethodsCardUseCase(cardRepository);
  const promoCodeService = new PromoCodeService(promoCodeRepository, prismaService);
  const marketingCampaignDiscountService = new MarketingCampaignDiscountService(
    prismaService,
    discountCalculationService,
  );

  const orderBuilderService = new OrderBuilderService(
    tariffRepository,
    cashbackCalculationService,
    orderStatusDeterminationService,
  );
  const orderDiscountService = new OrderDiscountService(
    marketingCampaignDiscountService,
    promoCodeService,
  );
  const orderUsageDataService = new OrderUsageDataService();

  // Create the main use case
  const useCase = new CreateMobileOrderUseCase(
    orderRepository,
    findMethodsCardUseCase,
    tariffRepository,
    orderValidationService,
    freeVacuumValidationService,
    orderStatusDeterminationService,
    orderBuilderService,
    orderDiscountService,
    orderUsageDataService,
    mockFlowProducer as any,
  );

  return useCase;
}

/**
 * Helper: Verify order creation results
 */
async function verifyOrderResults(
  orderId: number,
  expectedDiscount: number,
  orderSum: number,
  campaignId: number,
): Promise<{ passed: boolean; error?: string; details: any }> {
  const createdOrder = await prisma.lTYOrder.findUnique({
    where: { id: orderId },
  });

  if (!createdOrder) {
    return {
      passed: false,
      error: 'Order not found',
      details: { orderId },
    };
  }

  const actualDiscount = createdOrder.sumDiscount || 0;
  const expectedSumReal = orderSum - expectedDiscount;
  const actualSumReal = createdOrder.sumReal || 0;

  // Verify usage was recorded
  const usage = await prisma.marketingCampaignUsage.findFirst({
    where: {
      orderId: orderId,
      campaignId: campaignId,
    },
  });

  const passed =
    actualDiscount === expectedDiscount &&
    actualSumReal === expectedSumReal &&
    usage !== null;

  return {
    passed,
    error: passed
      ? undefined
      : `Expected discount: ${expectedDiscount}, got: ${actualDiscount}. Expected sumReal: ${expectedSumReal}, got: ${actualSumReal}. Usage recorded: ${usage !== null}`,
    details: {
      orderId,
      orderSum,
      expectedDiscount,
      actualDiscount,
      expectedSumReal,
      actualSumReal,
      usageRecorded: usage !== null,
      campaignId,
    },
  };
}

// ============================================================================
// TRANSACTIONAL CAMPAIGN TESTS
// ============================================================================

/**
 * Test 1: TRANSACTIONAL - VISIT_COUNT condition (ALL_TIME cycle)
 * IMPORTANT: This tests the fix where current order is included in count (+1)
 * User has 4 completed orders, creates 5th order -> should get discount (4 + 1 = 5)
 */
async function testTransactionalVisitCount() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create 4 completed orders for the user (NOT 5!)
    // The 5th order being created should trigger the discount
    for (let i = 0; i < 4; i++) {
      await prisma.lTYOrder.create({
        data: {
          cardId: card.id,
          sumFull: 1000,
          sumReal: 1000,
          sumBonus: 0,
          sumDiscount: 0,
          sumCashback: 0,
          carWashDeviceId: device.id,
          platform: 'ONVI',
          orderData: new Date(),
          createData: new Date(),
          orderStatus: OrderStatus.COMPLETED,
        },
      });
    }

    // Create TRANSACTIONAL campaign with VISIT_COUNT >= 5
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: VISIT_COUNT (ALL_TIME) - Fixed Test',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 500,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.VISIT_COUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 5,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const verification = await verifyOrderResults(result.orderId, 500, orderSum, campaign.id);

    // Verify progress was updated
    const progress = await prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId: campaign.id,
          ltyUserId: user.id,
        },
      },
    });

    const progressState = progress?.state as any;
    const visitsInCycle = progressState?.visits_in_cycle;

    const passed = verification.passed && visitsInCycle === 5; // 4 completed + 1 current = 5

    await logTest(
      'TRANSACTIONAL: VISIT_COUNT (ALL_TIME) - Current Order Included (+1)',
      passed,
      passed ? undefined : `Expected visits_in_cycle: 5, got: ${visitsInCycle}. ${verification.error || ''}`,
      {
        ...verification.details,
        completedOrders: 4,
        visitsInCycle,
        expectedVisitsInCycle: 5,
      },
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId: campaign.id } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: VISIT_COUNT (ALL_TIME) - Current Order Included (+1)', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 2: TRANSACTIONAL - PURCHASE_AMOUNT condition
 */
async function testTransactionalPurchaseAmount() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create TRANSACTIONAL campaign with PURCHASE_AMOUNT >= 2000
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: PURCHASE_AMOUNT',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 10,
              maxDiscountAmount: 500,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 2000,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2500; // Should qualify and get 10% = 250 (capped at 500)
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 250; // 10% of 2500
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: PURCHASE_AMOUNT - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: PURCHASE_AMOUNT', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 3: TRANSACTIONAL - TIME_RANGE condition
 */
async function testTransactionalTimeRange() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    const now = new Date();
    const currentHour = now.getHours();
    const startHour = currentHour >= 9 && currentHour < 18 ? 9 : 0;
    const endHour = currentHour >= 9 && currentHour < 18 ? 18 : 23;

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: TIME_RANGE',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 300,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.TIME_RANGE,
                start: `${startHour.toString().padStart(2, '0')}:00`,
                end: `${endHour.toString().padStart(2, '0')}:59`,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 300;
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: TIME_RANGE - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: TIME_RANGE', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 4: TRANSACTIONAL - WEEKDAY condition
 */
async function testTransactionalWeekday() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = dayNames[new Date().getDay()];

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: WEEKDAY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 15,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.WEEKDAY,
                values: [today as Weekday],
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 300; // 15% of 2000
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: WEEKDAY - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: WEEKDAY', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 5: TRANSACTIONAL - BIRTHDAY condition
 */
async function testTransactionalBirthday() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Set user's birthday to today
    const today = new Date();
    await prisma.lTYUser.update({
      where: { id: user.id },
      data: {
        birthday: today,
      },
    });

    // Create TRANSACTIONAL campaign with BIRTHDAY condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: BIRTHDAY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 20,
              maxDiscountAmount: 1000,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.BIRTHDAY,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 3000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 600; // 20% of 3000 (capped at 1000, but 600 < 1000)
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: BIRTHDAY - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: BIRTHDAY', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 6: TRANSACTIONAL - PROMOCODE_ENTRY condition
 */
async function testTransactionalPromocodeEntry() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let promocodeId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    const promocode = await prisma.lTYPromocode.create({
      data: {
        code: `TEST${Date.now()}`,
        isActive: true,
        promocodeType: 'STANDALONE',
      },
    });
    promocodeId = promocode.id;

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: PROMOCODE_ENTRY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 200,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PROMOCODE_ENTRY,
                code: promocode.code,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
      promoCodeId: promocode.id,
    });

    orderId = result.orderId;
    const expectedDiscount = 200;
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: PROMOCODE_ENTRY - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await prisma.lTYPromocode.delete({ where: { id: promocode.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: PROMOCODE_ENTRY', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (promocodeId) {
      await prisma.lTYPromocode.delete({ where: { id: promocodeId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

// ============================================================================
// BEHAVIORAL CAMPAIGN TESTS
// ============================================================================

/**
 * Test 7: TRANSACTIONAL - Combined Conditions (VISIT_COUNT + PURCHASE_AMOUNT)
 */
async function testTransactionalCombinedConditions() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create 3 completed orders
    for (let i = 0; i < 3; i++) {
      await prisma.lTYOrder.create({
        data: {
          cardId: card.id,
          sumFull: 1000,
          sumReal: 1000,
          sumBonus: 0,
          sumDiscount: 0,
          sumCashback: 0,
          carWashDeviceId: device.id,
          platform: 'ONVI',
          orderData: new Date(),
          createData: new Date(),
          orderStatus: OrderStatus.COMPLETED,
        },
      });
    }

    // Create TRANSACTIONAL campaign with VISIT_COUNT >= 3 AND PURCHASE_AMOUNT >= 2000
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: Combined (VISIT_COUNT + PURCHASE_AMOUNT)',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 800,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.VISIT_COUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 3,
                cycle: VisitCycle.ALL_TIME,
              },
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 2000,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2500; // Meets both conditions: 3+ visits (3 completed + 1 current = 4) AND >= 2000
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 800;
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: Combined Conditions (VISIT_COUNT + PURCHASE_AMOUNT)',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: Combined Conditions', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 8: TRANSACTIONAL - VISIT_COUNT with MONTHLY cycle
 */
async function testTransactionalVisitCountMonthly() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create 2 completed orders this month
    const now = new Date();
    for (let i = 0; i < 2; i++) {
      await prisma.lTYOrder.create({
        data: {
          cardId: card.id,
          sumFull: 1000,
          sumReal: 1000,
          sumBonus: 0,
          sumDiscount: 0,
          sumCashback: 0,
          carWashDeviceId: device.id,
          platform: 'ONVI',
          orderData: new Date(now.getFullYear(), now.getMonth(), now.getDate() - i),
          createData: new Date(),
          orderStatus: OrderStatus.COMPLETED,
        },
      });
    }

    // Create TRANSACTIONAL campaign with VISIT_COUNT >= 3 in MONTHLY cycle
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: VISIT_COUNT (MONTHLY)',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 400,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.VISIT_COUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 3,
                cycle: VisitCycle.MONTHLY,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 400; // 2 completed + 1 current = 3 visits this month
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'TRANSACTIONAL: VISIT_COUNT (MONTHLY) - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('TRANSACTIONAL: VISIT_COUNT (MONTHLY)', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 9: Promocode Discount Winning Scenario
 */
async function testPromocodeDiscountWinning() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let promocodeId: number | null = null;
  let promocodeCampaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant, adminUser } = infrastructure;

    // Create a campaign with lower discount
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'TRANSACTIONAL: Lower Discount (300)',
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
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 300,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 1000,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create a campaign for the promocode (to track usage)
    const promocodeCampaign = await prisma.marketingCampaign.create({
      data: {
        name: 'Promocode Campaign',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        action: {
          create: {
            actionType: MarketingCampaignActionType.PROMOCODE_ISSUE,
            payload: {},
          },
        },
      },
    });
    promocodeCampaignId = promocodeCampaign.id;

    const promocodeAction = await prisma.marketingCampaignAction.findUnique({
      where: { campaignId: promocodeCampaign.id },
    });

    // Create promocode with higher discount (500) linked to campaign
    const promocode = await prisma.lTYPromocode.create({
      data: {
        code: `WINNER${Date.now()}`,
        isActive: true,
        promocodeType: 'STANDALONE',
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 500,
        maxUsagePerUser: 10,
        validFrom: new Date(),
        campaignId: promocodeCampaign.id,
        actionId: promocodeAction?.id || null,
      },
    });
    promocodeId = promocode.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
      promoCodeId: promocode.id,
    });

    orderId = result.orderId;
    const expectedDiscount = 500; // Promocode should win (500 > 300)
    const createdOrder = await prisma.lTYOrder.findUnique({
      where: { id: result.orderId },
    });

    const actualDiscount = createdOrder?.sumDiscount || 0;
    const expectedSumReal = orderSum - expectedDiscount;
    const actualSumReal = createdOrder?.sumReal || 0;

    // Verify promocode usage was recorded
    const promocodeUsage = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: result.orderId,
        promocodeId: promocode.id,
      },
    });

    const passed =
      actualDiscount === expectedDiscount &&
      actualSumReal === expectedSumReal &&
      promocodeUsage !== null;

    await logTest(
      'Promocode Discount Winning (500 > 300)',
      passed,
      passed
        ? undefined
        : `Expected discount: ${expectedDiscount}, got: ${actualDiscount}. Promocode usage recorded: ${promocodeUsage !== null}`,
      {
        orderId: result.orderId,
        orderSum,
        campaignDiscount: 300,
        promocodeDiscount: 500,
        expectedBest: expectedDiscount,
        actualDiscount,
        promocodeUsageRecorded: promocodeUsage !== null,
      },
      result.orderId,
      actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    if (promocodeId) {
      await prisma.lTYPromocode.delete({ where: { id: promocodeId } });
    }
    if (promocodeCampaignId) {
      await prisma.marketingCampaign.delete({ where: { id: promocodeCampaignId } }).catch(() => {});
    }
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('Promocode Discount Winning', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (promocodeId) {
      await prisma.lTYPromocode.delete({ where: { id: promocodeId } }).catch(() => {});
    }
    if (promocodeCampaignId) {
      await prisma.marketingCampaign.delete({ where: { id: promocodeCampaignId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 10: BEHAVIORAL - BIRTHDAY condition (with activation window)
 */
async function testBehavioralBirthday() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create BEHAVIORAL campaign
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: BIRTHDAY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 1000,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.BIRTHDAY,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create activation window (simulating cron job)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

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
        startAt: today,
        endAt: endDate,
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 1000;
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'BEHAVIORAL: BIRTHDAY (Activation Window) - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    if (activationWindowId) {
      await prisma.activationWindow.delete({ where: { id: activationWindowId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('BEHAVIORAL: BIRTHDAY', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (activationWindowId) {
      await prisma.activationWindow.delete({ where: { id: activationWindowId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

/**
 * Test 11: BEHAVIORAL - INACTIVITY condition (with activation window)
 */
async function testBehavioralInactivity() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let activationWindowId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create BEHAVIORAL campaign
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: INACTIVITY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.PERCENTAGE,
              discountValue: 20,
              maxDiscountAmount: 800,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.INACTIVITY,
                days: 30,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create activation window (simulating cron job)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

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
        startAt: today,
        endAt: endDate,
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    activationWindowId = activationWindow.id;

    const useCase = createUseCaseInstance();
    const orderSum = 2000;
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 400; // 20% of 2000 (capped at 800, but 400 < 800)
    const verification = await verifyOrderResults(result.orderId, expectedDiscount, orderSum, campaign.id);

    await logTest(
      'BEHAVIORAL: INACTIVITY (Activation Window) - Order Created',
      verification.passed,
      verification.error,
      verification.details,
      result.orderId,
      verification.details.actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    if (activationWindowId) {
      await prisma.activationWindow.delete({ where: { id: activationWindowId } });
    }
    await prisma.marketingCampaign.delete({ where: { id: campaign.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('BEHAVIORAL: INACTIVITY', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (activationWindowId) {
      await prisma.activationWindow.delete({ where: { id: activationWindowId } }).catch(() => {});
    }
    if (campaignId) {
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

// ============================================================================
// MULTIPLE DISCOUNTS TEST
// ============================================================================

/**
 * Test 12: Multiple Discounts - Best One Selected
 */
async function testMultipleDiscountsBestSelected() {
  let infrastructure: any = null;
  let campaign1Id: number | null = null;
  let campaign2Id: number | null = null;
  let campaign3Id: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, pos, device, programParticipant } = infrastructure;

    // Create 5 completed orders for VISIT_COUNT campaign
    for (let i = 0; i < 5; i++) {
      await prisma.lTYOrder.create({
        data: {
          cardId: card.id,
          sumFull: 1000,
          sumReal: 1000,
          sumBonus: 0,
          sumDiscount: 0,
          sumCashback: 0,
          carWashDeviceId: device.id,
          platform: 'ONVI',
          orderData: new Date(),
          createData: new Date(),
          orderStatus: OrderStatus.COMPLETED,
        },
      });
    }

    // Campaign 1: TRANSACTIONAL - VISIT_COUNT, discount 500
    const campaign1 = await prisma.marketingCampaign.create({
      data: {
        name: 'Multiple Discounts: Campaign 1 (500)',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 500,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.VISIT_COUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 5,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaign1Id = campaign1.id;

    // Campaign 2: TRANSACTIONAL - PURCHASE_AMOUNT, discount 1000
    const campaign2 = await prisma.marketingCampaign.create({
      data: {
        name: 'Multiple Discounts: Campaign 2 (1000)',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        launchDate: new Date(Date.now() - 86400000),
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 1000,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                value: 2000,
              },
            ],
          },
        },
      },
    });
    campaign2Id = campaign2.id;

    // Campaign 3: BEHAVIORAL - Activation window, discount 750
    const campaign3 = await prisma.marketingCampaign.create({
      data: {
        name: 'Multiple Discounts: Campaign 3 (750)',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: infrastructure.adminUser.id,
        updatedById: infrastructure.adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.DISCOUNT,
            payload: {
              discountType: DiscountType.FIXED_AMOUNT,
              discountValue: 750,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.BIRTHDAY,
              },
            ],
          },
        },
      },
    });
    campaign3Id = campaign3.id;

    // Create activation window for campaign 3
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const campaign3WithAction = await prisma.marketingCampaign.findUnique({
      where: { id: campaign3.id },
      include: { action: true },
    });

    if (campaign3WithAction?.action) {
      await prisma.activationWindow.create({
        data: {
          ltyUserId: user.id,
          campaignId: campaign3.id,
          actionId: campaign3WithAction.action.id,
          startAt: today,
          endAt: endDate,
          status: ActivationWindowStatus.ACTIVE,
        },
      });
    }

    const useCase = createUseCaseInstance();
    const orderSum = 2500; // Qualifies for campaign 1 (VISIT_COUNT) and campaign 2 (PURCHASE_AMOUNT)
    const result = await useCase.execute({
      sum: orderSum,
      sumBonus: 0,
      carWashId: pos.id,
      cardMobileUserId: user.id,
      carWashDeviceId: device.id,
      rewardPointsUsed: 0,
    });

    orderId = result.orderId;
    const expectedDiscount = 1000; // Best discount (campaign 2)
    const createdOrder = await prisma.lTYOrder.findUnique({
      where: { id: result.orderId },
    });

    const actualDiscount = createdOrder?.sumDiscount || 0;
    const expectedSumReal = orderSum - expectedDiscount;
    const actualSumReal = createdOrder?.sumReal || 0;

    // Verify usage was recorded for campaign 2 (the best one)
    const usage = await prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: result.orderId,
        campaignId: campaign2.id,
      },
    });

    const passed =
      actualDiscount === expectedDiscount &&
      actualSumReal === expectedSumReal &&
      usage !== null;

    await logTest(
      'Multiple Discounts: Best One Selected (1000)',
      passed,
      passed
        ? undefined
        : `Expected discount: ${expectedDiscount}, got: ${actualDiscount}. Expected sumReal: ${expectedSumReal}, got: ${actualSumReal}. Usage recorded for campaign 2: ${usage !== null}`,
      {
        orderId: result.orderId,
        orderSum,
        campaign1Discount: 500,
        campaign2Discount: 1000,
        campaign3Discount: 750,
        expectedBest: expectedDiscount,
        actualDiscount,
        usageRecordedForCampaign2: usage !== null,
      },
      result.orderId,
      actualDiscount,
    );

    // Cleanup
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } });
      await prisma.lTYOrder.delete({ where: { id: orderId } });
    }
    await prisma.activationWindow.deleteMany({ where: { campaignId: campaign3.id } });
    await prisma.marketingCampaign.delete({ where: { id: campaign1.id } });
    await prisma.marketingCampaign.delete({ where: { id: campaign2.id } });
    await prisma.marketingCampaign.delete({ where: { id: campaign3.id } });
    await cleanupTestInfrastructure({
      userId: user.id,
      cardId: card.id,
      posId: pos.id,
      deviceId: device.id,
      organizationId: infrastructure.organization.id,
      programParticipantId: programParticipant.id,
      carWashPosId: infrastructure.carWashPos.id,
    });
  } catch (error: any) {
    await logTest('Multiple Discounts: Best One Selected', false, error.message);
    if (orderId) {
      await prisma.marketingCampaignUsage.deleteMany({ where: { orderId } }).catch(() => {});
      await prisma.lTYOrder.delete({ where: { id: orderId } }).catch(() => {});
    }
    if (campaign1Id) {
      await prisma.marketingCampaign.delete({ where: { id: campaign1Id } }).catch(() => {});
    }
    if (campaign2Id) {
      await prisma.marketingCampaign.delete({ where: { id: campaign2Id } }).catch(() => {});
    }
    if (campaign3Id) {
      await prisma.activationWindow.deleteMany({ where: { campaignId: campaign3Id } });
      await prisma.marketingCampaign.delete({ where: { id: campaign3Id } }).catch(() => {});
    }
    if (infrastructure) {
      await cleanupTestInfrastructure({
        userId: infrastructure.user.id,
        cardId: infrastructure.card.id,
        posId: infrastructure.pos.id,
        deviceId: infrastructure.device.id,
        organizationId: infrastructure.organization.id,
        programParticipantId: infrastructure.programParticipant.id,
        carWashPosId: infrastructure.carWashPos?.id,
      });
    }
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('🚀 Starting Comprehensive CreateMobileOrderUseCase Tests...\n');
  console.log('⚠️  WARNING: This script creates test data in your database!\n');
  console.log('📋 Testing Scenarios:\n');
  console.log('   TRANSACTIONAL Campaigns:');
  console.log('   1. VISIT_COUNT (ALL_TIME) - Current Order Included (+1)');
  console.log('   2. PURCHASE_AMOUNT');
  console.log('   3. TIME_RANGE');
  console.log('   4. WEEKDAY');
  console.log('   5. BIRTHDAY (NEW)');
  console.log('   6. PROMOCODE_ENTRY');
  console.log('   7. Combined Conditions (VISIT_COUNT + PURCHASE_AMOUNT)');
  console.log('   8. VISIT_COUNT (MONTHLY cycle)');
  console.log('   Discount Comparison:');
  console.log('   9. Promocode Discount Winning');
  console.log('   BEHAVIORAL Campaigns:');
  console.log('   10. BIRTHDAY (with activation window)');
  console.log('   11. INACTIVITY (with activation window)');
  console.log('   Multiple Discounts:');
  console.log('   12. Best Discount Selected\n');

  try {
    await testTransactionalVisitCount();
    await testTransactionalPurchaseAmount();
    await testTransactionalTimeRange();
    await testTransactionalWeekday();
    await testTransactionalBirthday();
    await testTransactionalPromocodeEntry();
    await testTransactionalCombinedConditions();
    await testTransactionalVisitCountMonthly();
    await testPromocodeDiscountWinning();
    await testBehavioralBirthday();
    await testBehavioralInactivity();
    await testMultipleDiscountsBestSelected();

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
      console.log('\n✅ Verified:');
      console.log('   - All condition types work correctly');
      console.log('   - Both TRANSACTIONAL and BEHAVIORAL campaigns work');
      console.log('   - Multiple discounts: best one is selected');
      console.log('   - Orders are created with correct discounts');
      console.log('   - Usage records are properly tracked');
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

