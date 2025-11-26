/**
 * Script to check the execution order of jobs in a BullMQ flow
 * 
 * This script queries Redis to get job states and execution times
 * to verify the order of job processing.
 * 
 * Usage: npx ts-node -r tsconfig-paths/register scripts/check-job-execution-order.ts <orderId>
 * 
 * Example: npx ts-node -r tsconfig-paths/register scripts/check-job-execution-order.ts 123
 */

import { Queue, FlowProducer } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

function getConnectionConfig() {
  return {
    host:
      configService.get<string>('REDIS_WORKER_DATA_HOST') ||
      configService.get<string>('REDIS_HOST') ||
      'localhost',
    port: parseInt(
      configService.get<string>('REDIS_WORKER_DATA_PORT') ||
        configService.get<string>('REDIS_PORT') ||
        '6379',
      10,
    ),
    username: configService.get<string>('REDIS_WORKER_DATA_USER'),
    password:
      configService.get<string>('REDIS_WORKER_DATA_PASSWORD') ||
      configService.get<string>('REDIS_PASSWORD'),
  };
}

interface JobInfo {
  id: string;
  name: string;
  queueName: string;
  state: string;
  processedOn?: number;
  finishedOn?: number;
  failedReason?: string;
  parentId?: string;
  data: any;
}

async function getJobInfo(queue: Queue, jobId: string): Promise<JobInfo | null> {
  try {
    const job = await queue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    const jobData = job.data || {};
    const parent = job.parent;

    return {
      id: job.id!,
      name: job.name || 'unknown',
      queueName: queue.name,
      state,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      parentId: parent?.id,
      data: jobData,
    };
  } catch (error: any) {
    console.error(`Error getting job ${jobId}:`, error.message);
    return null;
  }
}

async function findJobsByOrderId(orderId: number) {
  const connection = getConnectionConfig();
  const queues = [
    'order-finished',
    'check-car-wash-started',
    'car-wash-launch',
    'apply-marketing-campaign-rewards',
  ];

  const allJobs: JobInfo[] = [];

  for (const queueName of queues) {
    const queue = new Queue(queueName, { connection });
    
    try {
      // Get all jobs (completed, active, waiting, failed)
      const [completed, active, waiting, failed] = await Promise.all([
        queue.getJobs(['completed'], 0, 100),
        queue.getJobs(['active'], 0, 100),
        queue.getJobs(['waiting'], 0, 100),
        queue.getJobs(['failed'], 0, 100),
      ]);

      const allQueueJobs = [...completed, ...active, ...waiting, ...failed];
      
      for (const job of allQueueJobs) {
        if (job.data?.orderId === orderId) {
          const state = await job.getState();
          const parent = job.parent;
          
          allJobs.push({
            id: job.id!,
            name: job.name || 'unknown',
            queueName,
            state,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
            failedReason: job.failedReason,
            parentId: parent?.id,
            data: job.data || {},
          });
        }
      }
    } catch (error: any) {
      console.error(`Error querying queue ${queueName}:`, error.message);
    } finally {
      await queue.close();
    }
  }

  return allJobs;
}

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toISOString();
}

function printJobExecutionOrder(jobs: JobInfo[]) {
  console.log('\n📊 Job Execution Order Analysis\n');
  console.log('='.repeat(80));

  if (jobs.length === 0) {
    console.log('❌ No jobs found for this order ID');
    return;
  }

  // Sort by processedOn (when job started) or finishedOn
  const sortedJobs = [...jobs].sort((a, b) => {
    const timeA = a.processedOn || a.finishedOn || 0;
    const timeB = b.processedOn || b.finishedOn || 0;
    return timeA - timeB;
  });

  console.log('\n📋 Jobs in Execution Order:\n');
  sortedJobs.forEach((job, index) => {
    console.log(`${index + 1}. [${job.queueName}] ${job.name}`);
    console.log(`   Job ID: ${job.id}`);
    console.log(`   State: ${job.state}`);
    console.log(`   Started: ${formatTimestamp(job.processedOn)}`);
    console.log(`   Finished: ${formatTimestamp(job.finishedOn)}`);
    if (job.parentId) {
      console.log(`   Parent Job ID: ${job.parentId}`);
    }
    if (job.failedReason) {
      console.log(`   ❌ Failed: ${job.failedReason}`);
    }
    console.log('');
  });

  // Verify execution order
  console.log('\n🔍 Execution Order Verification:\n');
  
  const orderFinished = jobs.find(j => j.queueName === 'order-finished');
  const checkCarWash = jobs.find(j => j.queueName === 'check-car-wash-started');
  const carWashLaunch = jobs.find(j => j.queueName === 'car-wash-launch');
  const applyRewards = jobs.find(j => j.queueName === 'apply-marketing-campaign-rewards');

  if (orderFinished && checkCarWash) {
    const orderFinishedTime = orderFinished.finishedOn || orderFinished.processedOn || 0;
    const checkCarWashTime = checkCarWash.processedOn || 0;
    if (checkCarWashTime < orderFinishedTime) {
      console.log('❌ ERROR: check-car-wash-started started before order-finished completed!');
    } else {
      console.log('✅ order-finished completed before check-car-wash-started started');
    }
  }

  if (checkCarWash && carWashLaunch) {
    const checkCarWashTime = checkCarWash.finishedOn || checkCarWash.processedOn || 0;
    const carWashLaunchTime = carWashLaunch.processedOn || 0;
    if (carWashLaunchTime < checkCarWashTime) {
      console.log('❌ ERROR: car-wash-launch started before check-car-wash-started completed!');
    } else {
      console.log('✅ check-car-wash-started completed before car-wash-launch started');
    }
  }

  if (carWashLaunch && applyRewards) {
    const carWashLaunchTime = carWashLaunch.finishedOn || carWashLaunch.processedOn || 0;
    const applyRewardsTime = applyRewards.processedOn || 0;
    if (applyRewardsTime < carWashLaunchTime) {
      console.log('❌ ERROR: apply-marketing-campaign-rewards started before car-wash-launch completed!');
      console.log(`   car-wash-launch finished: ${formatTimestamp(carWashLaunch.finishedOn)}`);
      console.log(`   apply-marketing-campaign-rewards started: ${formatTimestamp(applyRewards.processedOn)}`);
    } else {
      console.log('✅ car-wash-launch completed before apply-marketing-campaign-rewards started');
    }
  } else if (applyRewards) {
    console.log('⚠️  apply-marketing-campaign-rewards found but car-wash-launch not found');
  }

  // Check parent-child relationships
  console.log('\n🔗 Parent-Child Relationships:\n');
  if (applyRewards && carWashLaunch) {
    if (applyRewards.parentId === carWashLaunch.id) {
      console.log('✅ apply-marketing-campaign-rewards is correctly a child of car-wash-launch');
    } else {
      console.log(`❌ ERROR: apply-marketing-campaign-rewards parent is ${applyRewards.parentId}, expected ${carWashLaunch.id}`);
    }
  }
}

async function main() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.error('❌ Please provide an order ID');
    console.log('Usage: npx ts-node -r tsconfig-paths/register scripts/check-job-execution-order.ts <orderId>');
    process.exit(1);
  }

  const orderIdNum = parseInt(orderId, 10);
  if (isNaN(orderIdNum)) {
    console.error('❌ Order ID must be a number');
    process.exit(1);
  }

  console.log(`\n🔍 Checking job execution order for order#${orderIdNum}...\n`);

  try {
    const jobs = await findJobsByOrderId(orderIdNum);
    printJobExecutionOrder(jobs);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

