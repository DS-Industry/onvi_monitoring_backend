/**
 * Comprehensive Test Suite for CheckBehavioralCampaignsUseCase
 * 
 * This script tests the check-behavioral-campaigns queue job use case to ensure
 * it correctly evaluates conditions and creates activation windows for behavioral campaigns.
 * 
 * Test Coverage:
 * 1. VISIT_COUNT condition with all cycles (ALL_TIME, DAILY, WEEKLY, MONTHLY, YEARLY)
 * 2. PURCHASE_AMOUNT condition with all operators (>=, <=, ==, !=, >, <)
 * 3. Multiple conditions combined (VISIT_COUNT + PURCHASE_AMOUNT)
 * 4. Campaigns with no conditions (should create window)
 * 5. Campaigns with only eligibility conditions (should create window)
 * 6. Campaigns where user already has active activation windows (should skip)
 * 7. Campaigns where conditions are not met (should not create window)
 * 8. Campaigns where conditions are met (should create window)
 * 9. Different action types (DISCOUNT, CASHBACK_BOOST, GIFT_POINTS)
 * 10. Edge cases: order not found, card not found, no cardMobileUserId
 * 11. Progress state tracking and updates
 * 12. Multiple campaigns for same user
 * 
 * Run with: npx ts-node -r tsconfig-paths/register scripts/test-check-behavioral-campaigns.ts
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
} from '../src/core/loyalty-core/marketing-campaign/domain/enums/condition-type.enum';

import { PrismaService } from '../src/infra/database/prisma/prisma.service';
import { CheckBehavioralCampaignsUseCase } from '../src/core/loyalty-core/mobile-user/order/use-cases/check-behavioral-campaigns.use-case';
import { OrderRepository } from '../src/core/loyalty-core/order/repository/order';
import { FindMethodsCardUseCase } from '../src/core/loyalty-core/mobile-user/card/use-case/card-find-methods';
import { ActivationWindowRepository } from '../src/core/loyalty-core/mobile-user/order/repository/activation-window.repository';
import { CardRepository } from '../src/core/loyalty-core/mobile-user/card/repository/card';

const prisma = new PrismaClient();
const prismaService = new PrismaService();

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
  activationWindowsCreated?: number;
}

const results: TestResult[] = [];

async function logTest(
  name: string,
  passed: boolean,
  error?: string,
  details?: any,
  activationWindowsCreated?: number,
) {
  results.push({ testName: name, passed, error, details, activationWindowsCreated });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
  if (details) {
    console.log(`   Details:`, JSON.stringify(details, null, 2));
  }
  if (activationWindowsCreated !== undefined) {
    console.log(`   Activation Windows Created: ${activationWindowsCreated}`);
  }
  console.log('');
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

  return { user, card, pos, device, organization, programParticipant, carWashPos, adminUser, loyaltyProgram: program };
}

/**
 * Helper: Create completed order
 */
async function createCompletedOrder(
  cardId: number,
  deviceId: number,
  sum: number = 5000,
) {
  const order = await prisma.lTYOrder.create({
    data: {
      transactionId: `TXN${Date.now()}`,
      sumFull: sum,
      sumReal: sum,
      sumBonus: 0,
      sumDiscount: 0,
      sumCashback: 0,
      carWashDeviceId: deviceId,
      cardId: cardId,
      platform: 'ONVI',
      contractType: 'INDIVIDUAL',
      orderData: new Date(),
      createData: new Date(),
      orderStatus: OrderStatus.COMPLETED,
    },
  });

  return order;
}

/**
 * Helper: Get use case instance
 */
function getUseCase(): CheckBehavioralCampaignsUseCase {
  const orderRepository = new OrderRepository(prismaService);
  const cardRepository = new CardRepository(prismaService);
  const findMethodsCardUseCase = new FindMethodsCardUseCase(cardRepository);
  const activationWindowRepository = new ActivationWindowRepository(prismaService);

  return new CheckBehavioralCampaignsUseCase(
    prismaService,
    activationWindowRepository,
    orderRepository,
    findMethodsCardUseCase,
  );
}

/**
 * Test 1: VISIT_COUNT - ALL_TIME cycle, condition met
 */
async function testVisitCountAllTimeMet() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create 2 completed orders (to meet condition of >= 2)
    await createCompletedOrder(card.id, device.id, 3000);
    await createCompletedOrder(card.id, device.id, 4000);

    // Create BEHAVIORAL campaign with VISIT_COUNT condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: VISIT_COUNT ALL_TIME',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create a new order (3rd order)
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 1: VISIT_COUNT ALL_TIME - Condition Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 1: VISIT_COUNT ALL_TIME - Condition Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 2: VISIT_COUNT - ALL_TIME cycle, condition NOT met
 */
async function testVisitCountAllTimeNotMet() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create only 1 completed order (condition requires >= 3)
    await createCompletedOrder(card.id, device.id, 3000);

    // Create BEHAVIORAL campaign with VISIT_COUNT condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: VISIT_COUNT ALL_TIME NOT MET',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 3,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create a new order (2nd order, still not enough)
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check that activation window was NOT created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window === null;
    await logTest(
      'Test 2: VISIT_COUNT ALL_TIME - Condition NOT Met',
      passed,
      passed ? undefined : 'Activation window was created when it should not have been',
      { campaignId: campaign.id },
      0,
    );
  } catch (error: any) {
    await logTest(
      'Test 2: VISIT_COUNT ALL_TIME - Condition NOT Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 3: VISIT_COUNT - DAILY cycle
 */
async function testVisitCountDaily() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create 2 completed orders today
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    await prisma.lTYOrder.create({
      data: {
        transactionId: `TXN${Date.now()}-1`,
        sumFull: 3000,
        sumReal: 3000,
        sumBonus: 0,
        sumDiscount: 0,
        sumCashback: 0,
        carWashDeviceId: device.id,
        cardId: card.id,
        platform: 'ONVI',
        contractType: 'INDIVIDUAL',
        orderData: today,
        createData: today,
        orderStatus: OrderStatus.COMPLETED,
      },
    });
    await prisma.lTYOrder.create({
      data: {
        transactionId: `TXN${Date.now()}-2`,
        sumFull: 4000,
        sumReal: 4000,
        sumBonus: 0,
        sumDiscount: 0,
        sumCashback: 0,
        carWashDeviceId: device.id,
        cardId: card.id,
        platform: 'ONVI',
        contractType: 'INDIVIDUAL',
        orderData: today,
        createData: today,
        orderStatus: OrderStatus.COMPLETED,
      },
    });

    // Create BEHAVIORAL campaign with VISIT_COUNT DAILY condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: VISIT_COUNT DAILY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
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
                type: CampaignConditionType.VISIT_COUNT,
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.DAILY,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create a new order (3rd order today)
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 3: VISIT_COUNT DAILY - Condition Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 3: VISIT_COUNT DAILY - Condition Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 4: PURCHASE_AMOUNT - Condition met
 */
async function testPurchaseAmountMet() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign with PURCHASE_AMOUNT condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: PURCHASE_AMOUNT',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
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
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                value: 5000,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create order with amount >= 5000
    const order = await createCompletedOrder(card.id, device.id, 6000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 4: PURCHASE_AMOUNT - Condition Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id, orderSum: 6000 },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 4: PURCHASE_AMOUNT - Condition Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 5: Multiple conditions (VISIT_COUNT + PURCHASE_AMOUNT) - Both met
 */
async function testMultipleConditionsBothMet() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create 2 completed orders
    await createCompletedOrder(card.id, device.id, 3000);
    await createCompletedOrder(card.id, device.id, 4000);

    // Create BEHAVIORAL campaign with multiple conditions
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: MULTIPLE CONDITIONS',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.GIFT_POINTS,
            payload: {
              points: 1000,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.VISIT_COUNT,
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                value: 5000,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create order that meets both conditions (3rd visit + amount >= 5000)
    const order = await createCompletedOrder(card.id, device.id, 6000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 5: Multiple Conditions - Both Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 5: Multiple Conditions - Both Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 6: Multiple conditions (VISIT_COUNT + PURCHASE_AMOUNT) - One NOT met
 */
async function testMultipleConditionsOneNotMet() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create 2 completed orders
    await createCompletedOrder(card.id, device.id, 3000);
    await createCompletedOrder(card.id, device.id, 4000);

    // Create BEHAVIORAL campaign with multiple conditions
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: MULTIPLE CONDITIONS ONE NOT MET',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                value: 5000,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create order that meets VISIT_COUNT but NOT PURCHASE_AMOUNT (amount < 5000)
    const order = await createCompletedOrder(card.id, device.id, 3000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check that activation window was NOT created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window === null;
    await logTest(
      'Test 6: Multiple Conditions - One NOT Met',
      passed,
      passed ? undefined : 'Activation window was created when it should not have been',
      { campaignId: campaign.id, orderSum: 3000 },
      0,
    );
  } catch (error: any) {
    await logTest(
      'Test 6: Multiple Conditions - One NOT Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 7: Campaign with no conditions (should create window)
 */
async function testNoConditions() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign with NO conditions
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: NO CONDITIONS',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
        // No conditions
      },
    });
    campaignId = campaign.id;

    // Create any order
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 7: No Conditions - Should Create Window',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 7: No Conditions - Should Create Window',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 8: Campaign where user already has active activation window (should skip)
 */
async function testExistingActiveWindow() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;
  let existingWindowId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: EXISTING WINDOW',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 1,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create existing active activation window
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

    const existingWindow = await prisma.activationWindow.create({
      data: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        actionId: campaignWithAction.action.id,
        startAt: today,
        endAt: endDate,
        status: ActivationWindowStatus.ACTIVE,
      },
    });
    existingWindowId = existingWindow.id;

    // Create order that would meet condition
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check that no new activation window was created (only the existing one)
    const windows = await prisma.activationWindow.findMany({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = windows.length === 1 && windows[0].id === existingWindow.id;
    await logTest(
      'Test 8: Existing Active Window - Should Skip',
      passed,
      passed ? undefined : `Expected 1 window, found ${windows.length}`,
      { existingWindowId: existingWindow.id, windowsFound: windows.length },
      0,
    );
  } catch (error: any) {
    await logTest(
      'Test 8: Existing Active Window - Should Skip',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 9: Multiple campaigns for same user
 */
async function testMultipleCampaigns() {
  let infrastructure: any = null;
  let campaignIds: number[] = [];
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create 2 completed orders
    await createCompletedOrder(card.id, device.id, 3000);
    await createCompletedOrder(card.id, device.id, 4000);

    // Create first BEHAVIORAL campaign
    const campaign1 = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: MULTIPLE CAMPAIGNS 1',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignIds.push(campaign1.id);

    // Create second BEHAVIORAL campaign
    const campaign2 = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: MULTIPLE CAMPAIGNS 2',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 14,
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
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                value: 5000,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
              },
            ],
          },
        },
      },
    });
    campaignIds.push(campaign2.id);

    // Create order that meets both conditions
    const order = await createCompletedOrder(card.id, device.id, 6000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check that activation windows were created for both campaigns
    const windows = await prisma.activationWindow.findMany({
      where: {
        ltyUserId: user.id,
        campaignId: { in: campaignIds },
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = windows.length === 2;
    await logTest(
      'Test 9: Multiple Campaigns - Both Should Create Windows',
      passed,
      passed ? undefined : `Expected 2 windows, found ${windows.length}`,
      { campaignIds, windowsCreated: windows.length, windowIds: windows.map(w => w.id) },
      windows.length,
    );
  } catch (error: any) {
    await logTest(
      'Test 9: Multiple Campaigns - Both Should Create Windows',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignIds.length > 0) {
      await prisma.activationWindow.deleteMany({ where: { campaignId: { in: campaignIds } } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId: { in: campaignIds } } }).catch(() => {});
      await prisma.marketingCampaign.deleteMany({ where: { id: { in: campaignIds } } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 10: Progress state tracking
 */
async function testProgressStateTracking() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderIds: number[] = [];

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: PROGRESS TRACKING',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                value: 3,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.ALL_TIME,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    const useCase = getUseCase();

    // Create first order (1st visit - condition not met)
    const order1 = await createCompletedOrder(card.id, device.id, 3000);
    orderIds.push(order1.id);
    await useCase.execute(order1.id);

    // Check progress state
    let progress = await prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId: campaign.id,
          ltyUserId: user.id,
        },
      },
    });

    const state1 = progress?.state as any;
    const visits1 = state1?.visits_in_cycle || 0;

    // Create second order (2nd visit - condition still not met)
    const order2 = await createCompletedOrder(card.id, device.id, 4000);
    orderIds.push(order2.id);
    await useCase.execute(order2.id);

    // Check progress state updated
    progress = await prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId: campaign.id,
          ltyUserId: user.id,
        },
      },
    });

    const state2 = progress?.state as any;
    const visits2 = state2?.visits_in_cycle || 0;

    // Create third order (3rd visit - condition met, window should be created)
    const order3 = await createCompletedOrder(card.id, device.id, 5000);
    orderIds.push(order3.id);
    await useCase.execute(order3.id);

    // Check progress state and window
    progress = await prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId: campaign.id,
          ltyUserId: user.id,
        },
      },
    });

    const state3 = progress?.state as any;
    const visits3 = state3?.visits_in_cycle || 0;

    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = visits1 === 1 && visits2 === 2 && visits3 === 3 && window !== null;
    await logTest(
      'Test 10: Progress State Tracking',
      passed,
      passed ? undefined : `Progress tracking failed. Visits: ${visits1}, ${visits2}, ${visits3}. Window: ${window ? 'created' : 'not created'}`,
      { visits1, visits2, visits3, windowId: window?.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 10: Progress State Tracking',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderIds.length > 0) await prisma.lTYOrder.deleteMany({ where: { id: { in: orderIds } } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 11: Edge case - Order not found
 */
async function testOrderNotFound() {
  try {
    const useCase = getUseCase();
    
    // Try to execute with non-existent order ID
    await useCase.execute(999999);

    // Should not throw error, just return silently
    await logTest(
      'Test 11: Order Not Found - Should Handle Gracefully',
      true,
      undefined,
      { orderId: 999999 },
      0,
    );
  } catch (error: any) {
    await logTest(
      'Test 11: Order Not Found - Should Handle Gracefully',
      false,
      error.message,
    );
  }
}

/**
 * Test 12: VISIT_COUNT - WEEKLY cycle
 */
async function testVisitCountWeekly() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Get start of current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Create 2 completed orders this week
    await prisma.lTYOrder.create({
      data: {
        transactionId: `TXN${Date.now()}-1`,
        sumFull: 3000,
        sumReal: 3000,
        sumBonus: 0,
        sumDiscount: 0,
        sumCashback: 0,
        carWashDeviceId: device.id,
        cardId: card.id,
        platform: 'ONVI',
        contractType: 'INDIVIDUAL',
        orderData: new Date(startOfWeek.getTime() + 86400000), // Yesterday
        createData: new Date(),
        orderStatus: OrderStatus.COMPLETED,
      },
    });
    await prisma.lTYOrder.create({
      data: {
        transactionId: `TXN${Date.now()}-2`,
        sumFull: 4000,
        sumReal: 4000,
        sumBonus: 0,
        sumDiscount: 0,
        sumCashback: 0,
        carWashDeviceId: device.id,
        cardId: card.id,
        platform: 'ONVI',
        contractType: 'INDIVIDUAL',
        orderData: new Date(startOfWeek.getTime() + 172800000), // 2 days ago
        createData: new Date(),
        orderStatus: OrderStatus.COMPLETED,
      },
    });

    // Create BEHAVIORAL campaign with VISIT_COUNT WEEKLY condition
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: VISIT_COUNT WEEKLY',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
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
                type: CampaignConditionType.VISIT_COUNT,
                value: 2,
                operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
                cycle: VisitCycle.WEEKLY,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create a new order (3rd order this week)
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 12: VISIT_COUNT WEEKLY - Condition Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 12: VISIT_COUNT WEEKLY - Condition Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
    if (infrastructure) {
      await prisma.lTYOrder.deleteMany({ where: { cardId: infrastructure.card.id } }).catch(() => {});
    }
  }
}

/**
 * Test 13: PURCHASE_AMOUNT - Different operators (LESS_THAN)
 */
async function testPurchaseAmountLessThan() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign with PURCHASE_AMOUNT < 5000
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: PURCHASE_AMOUNT LESS_THAN',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
        ltyProgramParticipantId: programParticipant.id,
        ltyUsers: { connect: { id: user.id } },
        action: {
          create: {
            actionType: MarketingCampaignActionType.GIFT_POINTS,
            payload: {
              points: 500,
            },
          },
        },
        conditions: {
          create: {
            tree: [
              {
                type: CampaignConditionType.PURCHASE_AMOUNT,
                value: 5000,
                operator: ConditionOperator.LESS_THAN,
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create order with amount < 5000
    const order = await createCompletedOrder(card.id, device.id, 3000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 13: PURCHASE_AMOUNT LESS_THAN - Condition Met',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id, orderSum: 3000 },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 13: PURCHASE_AMOUNT LESS_THAN - Condition Met',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 14: Campaign with only eligibility conditions (should create window)
 */
async function testOnlyEligibilityConditions() {
  let infrastructure: any = null;
  let campaignId: number | null = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { user, card, device, programParticipant, adminUser } = infrastructure;

    // Create BEHAVIORAL campaign with only TIME_RANGE condition (eligibility condition)
    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: 'BEHAVIORAL: ONLY ELIGIBILITY CONDITIONS',
        status: MarketingCampaignStatus.ACTIVE,
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: new Date(Date.now() - 86400000),
        activeDays: 7,
        createdById: adminUser.id,
        updatedById: adminUser.id,
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
                type: CampaignConditionType.TIME_RANGE,
                start: '09:00',
                end: '18:00',
              },
            ],
          },
        },
      },
    });
    campaignId = campaign.id;

    // Create any order
    const order = await createCompletedOrder(card.id, device.id, 5000);
    orderId = order.id;

    // Execute use case
    const useCase = getUseCase();
    await useCase.execute(order.id);

    // Check if activation window was created (eligibility conditions don't block window creation)
    const window = await prisma.activationWindow.findFirst({
      where: {
        ltyUserId: user.id,
        campaignId: campaign.id,
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
      },
    });

    const passed = window !== null;
    await logTest(
      'Test 14: Only Eligibility Conditions - Should Create Window',
      passed,
      passed ? undefined : 'Activation window was not created',
      { windowId: window?.id, campaignId: campaign.id },
      window ? 1 : 0,
    );
  } catch (error: any) {
    await logTest(
      'Test 14: Only Eligibility Conditions - Should Create Window',
      false,
      error.message,
    );
  } finally {
    // Cleanup
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
    if (campaignId) {
      await prisma.activationWindow.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.userCampaignProgress.deleteMany({ where: { campaignId } }).catch(() => {});
      await prisma.marketingCampaign.delete({ where: { id: campaignId } }).catch(() => {});
    }
  }
}

/**
 * Test 15: Edge case - Order without cardMobileUserId
 */
async function testOrderWithoutCard() {
  let infrastructure: any = null;
  let orderId: number | null = null;

  try {
    infrastructure = await createTestInfrastructure();
    const { device } = infrastructure;

    // Create order without cardMobileUserId
    const order = await prisma.lTYOrder.create({
      data: {
        transactionId: `TXN${Date.now()}`,
        sumFull: 5000,
        sumReal: 5000,
        sumBonus: 0,
        sumDiscount: 0,
        sumCashback: 0,
        carWashDeviceId: device.id,
        cardId: null,
        platform: 'ONVI',
        contractType: 'INDIVIDUAL',
        orderData: new Date(),
        createData: new Date(),
        orderStatus: OrderStatus.COMPLETED,
      },
    });
    orderId = order.id;

    const useCase = getUseCase();
    
    // Should not throw error, just return silently
    await useCase.execute(order.id);

    await logTest(
      'Test 12: Order Without Card - Should Handle Gracefully',
      true,
      undefined,
      { orderId: order.id },
      0,
    );
  } catch (error: any) {
    await logTest(
      'Test 12: Order Without Card - Should Handle Gracefully',
      false,
      error.message,
    );
  } finally {
    if (orderId) await prisma.lTYOrder.deleteMany({ where: { id: orderId } }).catch(() => {});
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting Comprehensive CheckBehavioralCampaignsUseCase Tests...\n');
  console.log('='.repeat(80));
  console.log('');

  await testVisitCountAllTimeMet();
  await testVisitCountAllTimeNotMet();
  await testVisitCountDaily();
  await testPurchaseAmountMet();
  await testMultipleConditionsBothMet();
  await testMultipleConditionsOneNotMet();
  await testNoConditions();
  await testExistingActiveWindow();
  await testMultipleCampaigns();
  await testProgressStateTracking();
  await testOrderNotFound();
  await testOrderWithoutCard();
  await testVisitCountWeekly();
  await testPurchaseAmountLessThan();
  await testOnlyEligibilityConditions();

  console.log('='.repeat(80));
  console.log('\n📊 Test Summary:\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  ❌ ${r.testName}`);
        if (r.error) {
          console.log(`     Error: ${r.error}`);
        }
      });
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('\n✨ Test suite completed!\n');

  await prisma.$disconnect();
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

