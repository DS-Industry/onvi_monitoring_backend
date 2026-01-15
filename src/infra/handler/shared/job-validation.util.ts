import { Logger } from '@nestjs/common';

export class JobValidationUtil {
  static validateRequiredField(
    value: any,
    fieldName: string,
    jobId: string,
    logger: Logger,
    prefix: string,
  ): void {
    if (value === undefined || value === null || value === '') {
      const error = new Error(`Missing required field: ${fieldName}`);
      logger.error(
        `[${prefix}] VALIDATION ERROR - ${error.message} | Job ${jobId}`,
      );
      throw error;
    }
  }

  static validateRequiredFields(
    data: Record<string, any>,
    fields: string[],
    jobId: string,
    logger: Logger,
    prefix: string,
  ): void {
    for (const field of fields) {
      this.validateRequiredField(data[field], field, jobId, logger, prefix);
    }
  }

  static logJobStart(
    jobId: string | undefined,
    orderId: any,
    attempt: number | undefined,
    maxAttempts: number | undefined,
    parentId: string | undefined,
    additionalData: Record<string, any>,
    logger: Logger,
    prefix: string,
  ): string {
    const startTime = new Date().toISOString();
    const attemptInfo = `Attempt ${attempt || 0}/${maxAttempts || 3}`;
    const parentInfo = `Parent: ${parentId || 'none'}`;
    const dataStr = JSON.stringify({ orderId, ...additionalData });
    
    logger.log(
      `[${prefix}] [${startTime}] START - Job ${jobId} for order#${orderId} | ${attemptInfo} | ${parentInfo} | Data: ${dataStr}`,
    );
    
    return startTime;
  }

  static logJobSuccess(
    jobId: string | undefined,
    orderId: number,
    startTime: string,
    logger: Logger,
    prefix: string,
  ): void {
    const endTime = new Date().toISOString();
    logger.log(
      `[${prefix}] [${endTime}] SUCCESS - Job ${jobId} completed successfully for order#${orderId}`,
    );
  }

  static logJobError(
    error: any,
    jobId: string | undefined,
    orderId: number,
    attempt: number | undefined,
    logger: Logger,
    prefix: string,
  ): void {
    const errorTime = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logger.error(
      `[${prefix}] [${errorTime}] ERROR - Failed to process order#${orderId}: ${errorMessage} | Job ${jobId} | Attempt ${attempt || 0} | Stack: ${errorStack}`,
    );
  }
}
