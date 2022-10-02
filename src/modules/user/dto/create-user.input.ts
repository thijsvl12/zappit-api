import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() username: string;

  @IsOptional() @IsNotEmpty() name: string;

  @IsNotEmpty() password: string;
}
