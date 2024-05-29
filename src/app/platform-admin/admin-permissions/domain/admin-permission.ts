import { BaseEntity } from '@utils/entity';
import { JSONObject } from '../../../../common/types/json-type';

export interface PermissionProps {
  id?: number;
  action: string;
  objectId: number;
  condition: JSONObject;
}
export class AdminPermission extends BaseEntity<PermissionProps> {
  constructor(props: PermissionProps) {
    super(props);
  }

  /**
   * @param condition: {"departmentId": "${id}"}
   * @param variables: {"id: 1"}
   * @return condition after parse: {"departmentId": 1}
   */
  public static parseCondition(
    condition: any,
    variables: Record<string, any>,
  ): any {
    if (!condition) return null;
    const parsedCondition = {};
    for (const [key, rawValue] of Object.entries(condition)) {
      if (rawValue !== null && typeof rawValue === 'object') {
        const value = this.parseCondition(rawValue, variables);
        parsedCondition[key] = value;
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

  get action(): string {
    return this.props.action;
  }

  get objectId(): number {
    return this.props.objectId;
  }

  get condition(): JSONObject {
    return this.props.condition;
  }
}
