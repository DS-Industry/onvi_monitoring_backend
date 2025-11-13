import { Injectable } from '@nestjs/common';
import {
  ExceptionType,
  ValidateLib,
  ValidateResponse,
} from '@platform-user/validate/validate.lib';
import { USER_UPDATE_ROLE_EXCEPTION_CODE } from '@constant/error.constants';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';

@Injectable()
export class UserPermissionValidateRules {
  constructor(
    private readonly validateLib: ValidateLib,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
  ) {}

  public async updateConnectedUserPosValidate(posIds: number[], ability: any) {
    const response: ValidateResponse[] = [];
    response.push(
      await this.validateLib.posIdAndPermissionsPosIdComparison(
        posIds,
        ability,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );
  }

  public async updateConnectedUserLoyaltyProgramValidate(
    loyaltyProgramIds: number[],
    ability: any,
  ) {
    const response: ValidateResponse[] = [];
    response.push(
      await this.validateLib.loyaltyProgramIdAndPermissionsLoyaltyProgramIdComparison(
        loyaltyProgramIds,
        ability,
      ),
    );
    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );
  }

  public async updateRoleValidate(userId: number, roleId: number) {
    const response = [];
    response.push(await this.validateLib.userByIdCheckOwner(userId));
    response.push(await this.validateLib.roleByIdExists(roleId));

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );
  }

  public async getUserLoyaltyProgramAccessValidate(
    userId: number,
    ability: any,
  ) {
    const response = [];

    const userCheck = await this.validateLib.userByIdExists(userId);
    response.push(userCheck);

    if (userCheck.code === 200 && userCheck.object) {
      const targetUserLoyaltyPrograms =
        await this.findMethodsLoyaltyProgramUseCase.getAllByUserId(userId);

      if (targetUserLoyaltyPrograms.length === 0) {
        response.push({
          code: 404,
          errorMessage: 'User does not manage any loyalty programs',
        });
      } else {
        const userLoyaltyProgramIds = this.extractLoyaltyProgramIds(ability);

        if (userLoyaltyProgramIds.length === 0) {
          response.push({
            code: 403,
            errorMessage: 'Access denied: No loyalty program permissions',
          });
        } else {
          const hasAccess = targetUserLoyaltyPrograms.some((program) =>
            userLoyaltyProgramIds.includes(program.id),
          );

          if (!hasAccess) {
            response.push({
              code: 403,
              errorMessage:
                "Access denied: You do not have access to this user's loyalty programs",
            });
          }
        }
      }
    }

    this.validateLib.handlerArrayResponse(
      response,
      ExceptionType.USER,
      USER_UPDATE_ROLE_EXCEPTION_CODE,
    );

    return userCheck.object;
  }

  private extractLoyaltyProgramIds(ability: any): number[] {
    const userLoyaltyProgramIds: number[] = [];
    if (ability && ability.rules) {
      for (const rule of ability.rules) {
        if (
          rule.subject === 'LTYProgram' &&
          rule.conditions &&
          rule.conditions.id
        ) {
          if (rule.conditions.id.in && Array.isArray(rule.conditions.id.in)) {
            userLoyaltyProgramIds.push(...rule.conditions.id.in);
          }
        }
      }
    }
    return userLoyaltyProgramIds;
  }
}
