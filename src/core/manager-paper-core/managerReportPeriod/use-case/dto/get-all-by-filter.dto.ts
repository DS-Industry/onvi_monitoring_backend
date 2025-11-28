export class GetAllByFilterDto {
  startPeriod: Date;
  endPeriod: Date;
  userId: number;
  skip?: number;
  take?: number;
}
