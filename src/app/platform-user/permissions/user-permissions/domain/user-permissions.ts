import { BaseEntity } from '@utils/entity';
import { PermissionAction } from '@prisma/client';


export interface PermissionProps {
  id?: number;
  action: PermissionAction;
  objectId: number;
}

export class UserPermission extends BaseEntity<PermissionProps> {
  constructor(props: PermissionProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get action(): PermissionAction {
    return this.props.action;
  }

  get objectId(): number {
    return this.props.objectId;
  }

  set action(action: PermissionAction) {
    this.props.action = action;
  }

  set objectId(objectId: number) {
    this.props.objectId = objectId;
  }
}
  