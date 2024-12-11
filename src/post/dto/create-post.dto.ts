import {IsNotEmpty, IsString, IsArray, IsOptional} from 'class-validator';
import { Types } from 'mongoose';
import {Commentaire} from "../../commentaire/entities/commentaire.entity";


export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string; // Titre du post

  @IsNotEmpty()
  @IsString()
  content: string; // Contenu du post

  // @IsNotEmpty()
  @IsOptional()
  user: object; // ID de l'utilisateur qui a créé le post

  @IsOptional()
  @IsArray()
  videos?: Types.ObjectId[]; // Liste des IDs des vidéos associées au post (facultatif)

  @IsOptional()
  nbLikes: number;

  @IsOptional()
  @IsString()
  type : string

  @IsNotEmpty()
  @IsOptional()
  commentaires: Commentaire[]; // Tableau d'objets Post





}
