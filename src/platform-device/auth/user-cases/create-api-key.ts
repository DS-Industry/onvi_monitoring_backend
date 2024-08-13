import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateApiKeyUseCase {
  constructor() {}
  async execute(organizationId: number): Promise<any> {
    const key = uuidv4();
    const issuedAt = new Date();

    return {
      key,
      issuedAt,
      expiryAt: new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000),
    };
  }
}
