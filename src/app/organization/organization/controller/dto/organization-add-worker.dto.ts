import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class AddWorkerOrganizationDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
}
