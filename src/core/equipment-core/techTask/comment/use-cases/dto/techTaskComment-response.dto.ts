export interface TechTaskCommentResponseDto {
  id: number;
  content: string;
  imageUrl?: string;
  techTaskId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}
