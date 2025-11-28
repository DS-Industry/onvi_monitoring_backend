import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ManagerPaperType } from '@manager-paper/managerPaper/domain/managerPaperType';

export class ManagerPaperTypeCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(ManagerPaperType)
  @IsNotEmpty({ message: 'type is required' })
  type: ManagerPaperType;
}
