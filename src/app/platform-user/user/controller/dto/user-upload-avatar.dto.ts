import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UploadAvatarUserDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}
