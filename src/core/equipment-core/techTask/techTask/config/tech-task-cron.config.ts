export interface TechTaskCronConfig {
  maxTasksPerBatch: number;
  batchSize: number;
  taskTimeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  enableDetailedLogging: boolean;
}

export const DEFAULT_TECH_TASK_CRON_CONFIG: TechTaskCronConfig = {
  maxTasksPerBatch: 100,
  batchSize: 10,
  taskTimeoutMs: 30000,
  maxRetries: 3,
  retryDelayMs: 1000,
  enableDetailedLogging: false,
};

export const getTechTaskCronConfig = (): TechTaskCronConfig => {
  return {
    maxTasksPerBatch: parseInt(
      process.env.TECH_TASK_MAX_BATCH_SIZE || '100',
      10,
    ),
    batchSize: parseInt(process.env.TECH_TASK_BATCH_SIZE || '10', 10),
    taskTimeoutMs: parseInt(process.env.TECH_TASK_TIMEOUT_MS || '30000', 10),
    maxRetries: parseInt(process.env.TECH_TASK_MAX_RETRIES || '3', 10),
    retryDelayMs: parseInt(process.env.TECH_TASK_RETRY_DELAY_MS || '1000', 10),
    enableDetailedLogging: process.env.TECH_TASK_DETAILED_LOGGING === 'true',
  };
};
