import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface PaymentOrchestrateJobData {
  orderId: number;
  transactionId: string;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: DeviceType;
}

export interface OrderFinishedJobData {
  orderId: number;
  transactionId?: string;
}

export interface CheckCarWashStartedJobData {
  orderId: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: DeviceType;
}

export interface CarWashLaunchJobData {
  orderId: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: DeviceType;
}

export interface ApplyMarketingCampaignRewardsJobData {
  orderId: number;
}

export enum JobResult {
  SUCCESS = 'success',
  SKIPPED = 'skipped',
  FAILED = 'failed',
}
