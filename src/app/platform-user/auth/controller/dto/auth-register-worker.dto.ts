import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRegisterWorkerDto {
  @IsString()
  @IsNotEmpty({ message: 'Password number is required' })
  password: string;
}
