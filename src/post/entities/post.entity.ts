import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string; // Titre du post

  @Prop({ required: true })
  content: string; // Contenu du post

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Référence à l'utilisateur qui a créé ce post

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Video' }] })
  videos: Types.ObjectId[]; // Référence aux vidéos associées à ce post
}

export const PostSchema = SchemaFactory.createForClass(Post);
