import { LTYUserMeta } from '@prisma/client';

export class ClientMeta {
  id: number;
  clientId: number;
  deviceId: number;
  model: string;
  name: string;
  platform: string;

  constructor(data: Partial<ClientMeta>) {
    Object.assign(this, data);
  }

  public static fromPrisma(ltyUserMeta: LTYUserMeta): ClientMeta {
    return new ClientMeta({
      id: ltyUserMeta.id,
      clientId: ltyUserMeta.clientId,
      deviceId: ltyUserMeta.deviceId,
      model: ltyUserMeta.model,
      name: ltyUserMeta.name,
      platform: ltyUserMeta.platform,
    });
  }

  public toPrisma(): Partial<LTYUserMeta> {
    return {
      clientId: this.clientId,
      deviceId: this.deviceId,
      model: this.model,
      name: this.name,
      platform: this.platform,
    };
  }

  public toPrismaForUpdate(): Partial<LTYUserMeta> {
    return {
      id: this.id,
      clientId: this.clientId,
      deviceId: this.deviceId,
      model: this.model,
      name: this.name,
      platform: this.platform,
    };
  }

  public update(data: Partial<ClientMeta>): void {
    Object.assign(this, data);
  }
}
