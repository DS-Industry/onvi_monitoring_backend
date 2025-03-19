import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
} from '@platform-user/validate/validate.lib';
import {
  LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
  LOYALTY_CREATE_TAG_EXCEPTION_CODE,
  LOYALTY_DELETE_TAG_EXCEPTION_CODE,
  LOYALTY_GET_ONE_EXCEPTION_CODE,
  LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
} from '@constant/error.constants';
import { Tag } from '@loyalty/mobile-user/tag/domain/tag';
import { Client } from '@loyalty/mobile-user/client/domain/client';

@Injectable()
export class LoyaltyValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createClientValidate(
    phone: string,
    tagIds: number[],
    devNumber?: number,
    number?: number,
  ) {
    const response = [];
    response.push(await this.validateLib.clientByPhoneNotExists(phone));
    response.push(await this.validateLib.tagIdsExists(tagIds));
    if (devNumber) {
      response.push(await this.validateLib.cardByDevNumberNotExists(devNumber));
    }
    if (number) {
      response.push(await this.validateLib.cardByNumberNotExists(number));
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_CLIENT_EXCEPTION_CODE,
    );
  }

  public async getClientByIdValidate(id: number): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
    response.push(checkClient);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_GET_ONE_EXCEPTION_CODE,
    );
    return checkClient.object;
  }

  public async updateClientValidate(
    id: number,
    tagIds?: number[],
  ): Promise<Client> {
    const response = [];
    const checkClient = await this.validateLib.clientByIdExists(id);
    response.push(checkClient);
    if (tagIds) {
      response.push(await this.validateLib.tagIdsExists(tagIds));
    }
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_UPDATE_TAG_EXCEPTION_CODE,
    );
    return checkClient.object;
  }

  public async createTagValidate(name: string) {
    const response = [];
    response.push(await this.validateLib.tegByNameNotExists(name));
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_CREATE_TAG_EXCEPTION_CODE,
    );
  }

  public async deleteTagValidate(id: number): Promise<Tag> {
    const response = [];
    const checkTag = await this.validateLib.tegByIdExists(id);
    response.push(checkTag);
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.LOYALTY,
      LOYALTY_DELETE_TAG_EXCEPTION_CODE,
    );
    return checkTag.object;
  }
}
