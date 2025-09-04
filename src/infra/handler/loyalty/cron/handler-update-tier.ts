import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class HandlerUpdateTierCron {
  constructor() {
  }

  @Cron('0 0 28 * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {

  }
}