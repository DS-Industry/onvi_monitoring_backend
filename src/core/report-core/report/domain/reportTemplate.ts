import { CategoryReportTemplate } from '@prisma/client';
import { BaseEntity } from '@utils/entity';

export interface ReportTemplateProps {
  id?: number;
  name: string;
  category: CategoryReportTemplate;
  description?: string;
  query: string;
  params: JSON;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReportTemplate extends BaseEntity<ReportTemplateProps> {
  constructor(props: ReportTemplateProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): CategoryReportTemplate {
    return this.props.category;
  }

  get description(): string {
    return this.props.description;
  }

  get query(): string {
    return this.props.query;
  }

  get params(): JSON {
    return this.props.params;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set category(category: CategoryReportTemplate) {
    this.props.category = category;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set query(query: string) {
    this.props.query = query;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }
}
