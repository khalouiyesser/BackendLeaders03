import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {


  @IsString()
  user_id: string;

  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  newPassword: string;
}
