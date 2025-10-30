export enum DeviceType {
  BAY = 'BAY',
  PORTAL = 'PORTAL',
  VACUUME = 'VACUUME',
}

export abstract class IPosService {
  abstract ping(data: PingRequestDto): Promise<PingResponseDto>;
  abstract send(data: SendRequestDto): Promise<SendResponseDto>;
}

export interface PingRequestDto {
  posId: number;
  // carWashDeviceId: number;
  bayNumber: number;
  type?: DeviceType | null;
}

export interface PingResponseDto {
  id: string | null;
  status: string;
  type: string | null;
  errorMessage: string | null;
}

export interface SendRequestDto {
  deviceId: string;
  cardNumber: string;
  sum: string;
}

export enum SendStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export interface SendResponseDto {
  sendStatus: SendStatus;
  errorMessage: string | null;
}
