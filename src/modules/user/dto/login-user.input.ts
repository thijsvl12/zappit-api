import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty() username;

  @IsNotEmpty() password;
}
