import { IsEmail, IsOptional, IsString, IsUrl, Length, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {



  @ApiProperty({ example: 'John', description: 'Le nom complet de l\'utilisateur' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Le prénom l\'utilisateur' })
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'JohnDoe@gmail.com', description: 'L\'email  de l\'utilisateur' })
  @IsEmail()
  email: string;




  @ApiProperty({ example: 'JohnDoe', description: 'Le password de l\'utilisateur' })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number' })
  password: string;



  @IsOptional()
  @IsUrl()
  website: string;

  @IsString()
  @Length(4)
  @IsOptional()
  codePostal: string;

  @ApiProperty({ example: 'IT', description: 'Informaticien' })
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

  @IsOptional()
  @IsString()
  photoUrl: string;


  @IsOptional()
  @IsString()
  Bio : string







}
