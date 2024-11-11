import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';



export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  lieu : string

  @IsNumber()
  @IsNotEmpty()
  anneeDebut : number

  @IsNumber()
  @IsNotEmpty()
  anneeFin : number

  @IsString()
  @IsNotEmpty()
  Diplome: string

  @IsNotEmpty()
  user: Types.ObjectId; // ID de l'utilisateur qui a créé le post
}
