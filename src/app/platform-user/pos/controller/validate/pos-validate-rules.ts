import { Injectable } from '@nestjs/common';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class PosValidateRules {
  constructor(private readonly findMethodsPosUseCase: FindMethodsPosUseCase) {}

  public async createValidate(name: string) {
    const response = await this.checkName(name);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  private async checkName(name: string): Promise<number> {
    const pos = await this.findMethodsPosUseCase.getByName(name);
    if (pos) {
      return 463;
    }
    return 200;
  }
}
