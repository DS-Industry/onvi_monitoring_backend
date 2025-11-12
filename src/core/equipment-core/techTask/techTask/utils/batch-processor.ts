import { Logger } from '@nestjs/common';

export interface BatchProcessorOptions {
  batchSize: number;
  maxConcurrency: number;
  timeoutMs?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
}

export interface BatchProcessorResult<T, R> {
  successful: R[];
  failed: Array<{ item: T; error: Error }>;
  totalProcessed: number;
  executionTimeMs: number;
}

export class BatchProcessor {
  private readonly logger = new Logger(BatchProcessor.name);

  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: BatchProcessorOptions,
  ): Promise<BatchProcessorResult<T, R>> {
    const startTime = Date.now();
    const result: BatchProcessorResult<T, R> = {
      successful: [],
      failed: [],
      totalProcessed: 0,
      executionTimeMs: 0,
    };

    if (items.length === 0) {
      result.executionTimeMs = Date.now() - startTime;
      return result;
    }

    this.logger.log(
      `Starting batch processing of ${items.length} items with batch size ${options.batchSize}`,
    );

    const batches = this.chunkArray(items, options.batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      this.logger.debug(
        `Processing batch ${i + 1}/${batches.length} with ${batch.length} items`,
      );

      const batchResults = await this.processBatchWithConcurrency(
        batch,
        processor,
        options,
      );

      result.successful.push(...batchResults.successful);
      result.failed.push(...batchResults.failed);
      result.totalProcessed += batch.length;
    }

    result.executionTimeMs = Date.now() - startTime;
    this.logger.log(
      `Batch processing completed: ${result.successful.length} successful, ${result.failed.length} failed, ${result.executionTimeMs}ms`,
    );

    return result;
  }

  private async processBatchWithConcurrency<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: BatchProcessorOptions,
  ): Promise<{ successful: R[]; failed: Array<{ item: T; error: Error }> }> {
    const successful: R[] = [];
    const failed: Array<{ item: T; error: Error }> = [];

    const semaphore = new Semaphore(options.maxConcurrency);

    const promises = items.map(async (item) => {
      await semaphore.acquire();

      try {
        const result = await this.processWithRetry(item, processor, options);
        successful.push(result);
      } catch (error) {
        failed.push({ item, error: error as Error });
      } finally {
        semaphore.release();
      }
    });

    await Promise.all(promises);
    return { successful, failed };
  }

  private async processWithRetry<T, R>(
    item: T,
    processor: (item: T) => Promise<R>,
    options: BatchProcessorOptions,
  ): Promise<R> {
    const maxAttempts = options.retryAttempts || 1;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (options.timeoutMs) {
          return await this.withTimeout(processor(item), options.timeoutMs);
        } else {
          return await processor(item);
        }
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          const delay = options.retryDelayMs || 1000;
          this.logger.warn(
            `Attempt ${attempt} failed, retrying in ${delay}ms: ${error.message}`,
          );
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs,
      );
    });

    return Promise.race([promise, timeoutPromise]);
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift()!;
      this.permits--;
      resolve();
    }
  }
}
