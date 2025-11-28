import { IsArray, IsOptional } from 'class-validator';

export class ConnectedPodUserDto {
  @IsArray()
  @IsOptional()
  posIds: number[];
}
