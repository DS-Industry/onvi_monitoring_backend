import { Injectable } from '@nestjs/common';
import { IActivationWindowRepository } from '../interface/activation-window-repository.interface';

export interface GetActivationWindowsRequest {
  ltyUserId: number;
}

export interface ActivationWindowResponse {
  id: number;
  campaignId: number;
  actionId: number;
  startAt: Date;
  endAt: Date | null;
  status: string;
  actionType: string;
  payload: any;
}

@Injectable()
export class GetActivationWindowsUseCase {
  constructor(
    private readonly activationWindowRepository: IActivationWindowRepository,
  ) {}

  async execute(
    request: GetActivationWindowsRequest,
  ): Promise<ActivationWindowResponse[]> {
    const activeWindows =
      await this.activationWindowRepository.findActiveActivationWindows(
        request.ltyUserId,
      );

    return activeWindows.map((window) => ({
      id: window.id,
      campaignId: window.campaignId,
      actionId: window.actionId,
      startAt: window.startAt,
      endAt: window.endAt,
      status: window.status,
      actionType: window.actionType,
      payload: window.payload,
    }));
  }
}

