import { Injectable } from '@nestjs/common';
import {
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { ForbiddenError } from '@casl/ability';
import { PermissionAction } from '@prisma/client';
import { TechTask } from '@tech-task/techTask/domain/techTask';

@Injectable()
export class TechTaskValidateRules {
  constructor(private readonly validateLib: ValidateLib) {}

  public async createValidate(
    posId: number,
    techTaskItem: number[],
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    const checkPos = await this.validateLib.posByIdExists(posId);
    response.push(checkPos);
    await Promise.all(
      techTaskItem.map(async (item) => {
        response.push(await this.validateLib.itemTemplateByIdExists(item));
      }),
    );

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      checkPos.object,
    );
  }

  public async updateValidate(
    techTaskId: number,
    ability: any,
    techTaskItem?: number[],
  ): Promise<TechTask> {
    const response: ValidateResponse[] = [];
    const techTaskCheck = await this.validateLib.techTaskByIdExists(techTaskId);
    response.push(techTaskCheck);
    if (techTaskItem) {
      await Promise.all(
        techTaskItem.map(async (item) => {
          response.push(await this.validateLib.itemTemplateByIdExists(item));
        }),
      );
    }

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.update,
      techTaskCheck.object,
    );
    return techTaskCheck.object;
  }

  public async getShapeByIdValidate(
    id: number,
    ability: any,
  ): Promise<TechTask> {
    const response = await this.validateLib.techTaskByIdExists(id);

    if (response.code !== 200) {
      throw new Error(`Validation errors: ${response.code}`);
    }

    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      response.object,
    );
    return response.object;
  }

  public async completionShapeByIdValidate(
    id: number,
    itemIds: number[],
    ability: any,
  ): Promise<TechTask> {
    const response: ValidateResponse[] = [];
    const techTaskCheck =
      await this.validateLib.techTaskByIdAndStatusExists(id);
    response.push(techTaskCheck);
    response.push(
      await this.validateLib.techTaskItemComparisonByIdAndList(id, itemIds),
    );

    this.validateLib.handlerArrayResponse(response);
    ForbiddenError.from(ability).throwUnlessCan(
      PermissionAction.read,
      techTaskCheck.object,
    );
    return techTaskCheck.object;
  }
}
