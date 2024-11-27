
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Post} from "../../post/entities/post.entity";
import {User} from "../../auth/schemas/user.schema";

@Schema()
export class Commentaire extends Document {
    @Prop({ required: true, type: Object })  // Référence à la collection User
    user: User;

    @Prop({ required: true })
    Contenu: string;

    @Prop({ required: true, type: Object }) // Référence à la collection Post
    post: Post;
}

export const CommentaireSchema = SchemaFactory.createForClass(Commentaire);
