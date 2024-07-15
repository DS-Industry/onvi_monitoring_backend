import { BaseEntity } from '@utils/entity';
import { JSONObject } from '@common/types/json-type';
import { PermissionAction } from '@prisma/client';


export interface PermissionProps {
    id?: number;
    name: string
    permissionModule:string     
}

export class UserPermission extends BaseEntity<PermissionProps> {
  constructor(props: PermissionProps) {
    super(props);
  }

  /**
   * @return condition after parse: {"departmentId": 1}
   * @param condition
   * @param variables
   */
  public static parseCondition(
    condition: any,
    variables: Record<string, any>,
  ): any {
    if (!condition) return null;
    const parsedCondition = {};
    for (const [key, rawValue] of Object.entries(condition)) {
      if (rawValue !== null && typeof rawValue === 'object') {
        parsedCondition[key] = this.parseCondition(rawValue, variables);
        continue;
      }
      if (typeof rawValue !== 'string') {
        parsedCondition[key] = rawValue;
        continue;
      }
      // find placeholder "${}""
      const matches = /^\\${([a-zA-Z0-9]+)}$/.exec(rawValue);
      if (!matches) {
        parsedCondition[key] = rawValue;
        continue;
      }
      const value = variables[matches[1]];
      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }
      parsedCondition[key] = value;
    }
    return parsedCondition;
  }

  get id(): number {
    return this.props.id;
  }
get name():string{
  return this.props.name
}
get permissionModule():string{
  return this.props.permissionModule
}


}
  