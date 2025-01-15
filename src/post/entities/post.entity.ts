import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {Commentaire} from "../../commentaire/entities/commentaire.entity";

@Schema({ timestamps: true })
export class Post {
  toObject(): any {
      throw new Error('Method not implemented.');
  }

  @Prop({ required: true })
  title: string; // Titre du post

  @Prop({ required: true })
  content: string; // Contenu du post

  // @Prop({ required: true, type: Object }) // Référence à la collection Post
  // post: Post;


  @Prop({ type: [{ type: Types.ObjectId, ref: 'Video' }] })
  videos: Types.ObjectId[]; // Référence aux vidéos associées à ce post

  @Prop({ default: 'hiring' })
  type: string;

  @Prop({ default: false })
  cloture: string;

  @Prop()
  videoUrl: string;

  @Prop({ type: [{ type: Object }] }) // Tableau d'objets complets
  commentaires: Commentaire[];


  @Prop({default : 0 })
  nbLikes: number;

  @Prop({ required: false, type: Object }) // Référence à la collection Post
  user: User;

  @Prop()
  userName: string;
  @Prop()
  photoUrl: string;

  @Prop()
  survey: string[];


}

export const PostSchema = SchemaFactory.createForClass(Post);
