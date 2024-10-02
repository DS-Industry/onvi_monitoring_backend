export class PosCreateDto {
  name: string;
  monthlyPlan?: number;
  posMetaData?: string;
  timezone: number;
  address: {
    city: string;
    location: string;
    lat?: number;
    lon?: number;
  };
  image?: string;
  status: string;
  organizationId: number;
}
