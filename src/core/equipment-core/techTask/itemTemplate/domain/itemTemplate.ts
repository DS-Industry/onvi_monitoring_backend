import {
  GroupTechTaskItemTemplate,
  TypeTechTaskItemTemplate,
} from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface TechTaskItemTemplateProps {
  id?: number;
  title: string;
  code?: string;
  type: TypeTechTaskItemTemplate;
  group: GroupTechTaskItemTemplate;
}

export class TechTaskItemTemplate extends BaseEntity<TechTaskItemTemplateProps> {
  constructor(props: TechTaskItemTemplateProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get code(): string {
    return this.props.code;
  }

  get type(): TypeTechTaskItemTemplate {
    return this.props.type;
  }

  get group(): GroupTechTaskItemTemplate {
    return this.props.group;
  }

  set title(title: string) {
    this.props.title = title;
  }

  set code(code: string) {
    this.props.code = code;
  }

  set type(type: TypeTechTaskItemTemplate) {
    this.props.type = type;
  }

  set group(group: GroupTechTaskItemTemplate) {
    this.props.group = group;
  }
}
