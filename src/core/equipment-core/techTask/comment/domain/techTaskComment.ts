import { BaseEntity } from '@utils/entity';

export interface TechTaskCommentProps {
  id?: number;
  content: string;
  imageUrl?: string;
  techTaskId: number;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
  author?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export class TechTaskComment extends BaseEntity<TechTaskCommentProps> {
  constructor(props: TechTaskCommentProps) {
    super(props);
  }

  get id(): number {
    return this.props.id;
  }

  get content(): string {
    return this.props.content;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get techTaskId(): number {
    return this.props.techTaskId;
  }

  get authorId(): number {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get author():
    | { id: number; firstName: string; lastName: string }
    | undefined {
    return this.props.author;
  }

  public updateContent(content: string, imageUrl?: string): void {
    this.props.content = content;
    if (imageUrl !== undefined) {
      this.props.imageUrl = imageUrl;
    }
    this.props.updatedAt = new Date();
  }
}
