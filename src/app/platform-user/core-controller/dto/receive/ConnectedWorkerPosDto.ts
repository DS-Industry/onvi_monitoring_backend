import { IsArray, IsOptional } from 'class-validator';

export class ConnectedWorkerPosDto {
  @IsArray()
  @IsOptional()
  workerIds: number[];
}
