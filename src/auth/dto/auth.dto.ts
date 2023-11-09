import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  nickname: string;
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9]*$/)
  password: string;
}
