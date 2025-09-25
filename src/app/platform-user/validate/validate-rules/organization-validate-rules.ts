import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import {
  ORGANIZATION_ADD_WORKER_EXCEPTION_CODE,
  ORGANIZATION_CREATE_EXCEPTION_CODE,
  ORGANIZATION_GET_ONE_BY_ID_EXCEPTION_CODE,
  ORGANIZATION_UPDATE_EXCEPTION_CODE,
  ORGANIZATION_VERIFICATE_EXCEPTION_CODE,
  USER_GET_CONTACT_EXCEPTION_CODE,
} from '@constant/error.constants';
import {
  OrganizationException,
  UserException,
} from '@exception/option.exceptions';

@Injectable()
export class OrganizationValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async addWorkerValidate(email: string, organizationId: number) {
    const response = [];
    response.push(await this.validateLib.userByEmailNotExists(email));
    response.push(
      await this.validateLib.organizationByIdExists(organizationId),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.ORGANIZATION,
      ORGANIZATION_ADD_WORKER_EXCEPTION_CODE,
    );
  }

  public async verificateValidate(organizationId: number) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_VERIFICATE_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
    return response.object;
  }

  public async updateValidate(organizationId: number, ability: any) {
    const response =
      await this.validateLib.organizationByIdExists(organizationId);

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_UPDATE_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      response.object,
    );
    return response.object;
  }

  public async getOneByIdValidate(id: number, ability: any) {
    const response = await this.validateLib.organizationByIdExists(id);

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_GET_ONE_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      response.object,
    );
    return response.object;
  }

  public async getContact(id: number) {
    const response = await this.validateLib.organizationByIdExists(id);
    if (response.code !== 200) {
      throw new UserException(
        ORGANIZATION_GET_ONE_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
    return response.object;
  }

  public async createValidate(name: string) {
    const response = await this.validateLib.organizationByNameNotExists(name);

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_CREATE_EXCEPTION_CODE,
        response.errorMessage,
      );
    }
  }

  public async validateUserBelongsToOrganization(
    userId: number,
    organizationId: number,
  ) {
    const response = await this.validateLib.userBelongsToOrganization(
      userId,
      organizationId,
    );

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_GET_ONE_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    return response.object;
  }

  public async validateUserBelongsToOrganizations(
    userId: number,
    organizationIds: number[],
  ) {
    const response = await this.validateLib.userBelongsToOrganizations(
      userId,
      organizationIds,
    );

    if (response.code !== 200) {
      throw new OrganizationException(
        ORGANIZATION_GET_ONE_BY_ID_EXCEPTION_CODE,
        response.errorMessage,
      );
    }

    return response.object;
  }
}
