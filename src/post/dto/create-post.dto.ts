import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string; // Titre du post

  @IsNotEmpty()
  @IsString()
  content: string; // Contenu du post

  @IsNotEmpty()
  user: Types.ObjectId; // ID de l'utilisateur qui a créé le post

  @IsOptional()
  @IsArray()
  videos?: Types.ObjectId[]; // Liste des IDs des vidéos associées au post (facultatif)
}
