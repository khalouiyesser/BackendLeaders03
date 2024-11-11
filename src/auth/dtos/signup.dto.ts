import { IsEmail, IsOptional, IsString, IsUrl, Length, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;


  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password: string;



  @IsOptional()
  @IsUrl()
  website: string;

  @IsString()
  @Length(6)
  @IsOptional()
  codePostal: string;


  @IsOptional()
  @IsString()
  domaine: string;


  @IsOptional()
  @IsString()
  education: string;


  @IsOptional()
  @IsString()
  cv: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;


  @IsOptional()
  @IsString()
  score: string;








}
