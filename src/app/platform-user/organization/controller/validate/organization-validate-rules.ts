import { Injectable } from '@nestjs/common';
import { GetByEmailUserUseCase } from '@platform-user/user/use-cases/user-get-by-email';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';

@Injectable()
export class OrganizationValidateRules {
  constructor(
    private readonly getByEmailUserUseCase: GetByEmailUserUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
  ) {}

  public async addWorkerValidate(
    email: string,
    organizationId: number,
    userId: number,
  ) {
    const response = [];
    response.push(await this.checkUserEmail(email));
    response.push(await this.checkOwner(organizationId, userId));

    const hasErrors = response.some((code) => code !== 200);
    if (hasErrors) {
      const errorCodes = response.filter((code) => code !== 200);
      throw new Error(`Validation errors: ${errorCodes.join(', ')}`);
    }
  }

  public async verificateValidate(organizationId: number) {
    const response = await this.checkDocument(organizationId);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async getOneByIdValidate(id: number) {
    const response = await this.checkId(id);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  public async createValidate(name: string) {
    const response = await this.checkName(name);

    if (response !== 200) {
      throw new Error(`Validation errors: ${response}`);
    }
  }

  private async checkUserEmail(email: string): Promise<number> {
    const checkUserEmail = await this.getByEmailUserUseCase.execute(email);
    if (checkUserEmail) {
      return 450;
    }
    return 200;
  }

  private async checkOwner(
    organizationId: number,
    userId: number,
  ): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.ownerId !== userId) {
      return 451;
    }
    return 200;
  }

  private async checkDocument(organizationId: number): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (organization.organizationDocumentId) {
      return 452;
    }
    return 200;
  }

  private async checkName(name: string): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getByName(name);
    if (organization.organizationDocumentId) {
      return 453;
    }
    return 200;
  }

  private async checkId(organizationId: number): Promise<number> {
    const organization =
      await this.findMethodsOrganizationUseCase.getById(organizationId);
    if (!organization) {
      return 454;
    }
    return 200;
  }
}
