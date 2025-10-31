export const IFLOW_PRODUCER = Symbol('IFlowProducer');

export interface IFlowProducer {
  add(config: FlowJobConfig): Promise<void>;
}

export interface FlowJobConfig {
  name: string;
  queueName: string;
  data: any;
  children?: FlowJobConfig[];
  opts?: FlowJobOptions;
}

export interface FlowJobOptions {
  failParentOnFailure?: boolean;
  ignoreDependencyOnFailure?: boolean;
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
}

