import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";


export class Commentaire {



    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId; // Référence à l'utilisateur qui a créé ce post

    @Prop()
    Contenu : string;

    @Prop({ type: Types.ObjectId, ref: 'PostF', required: true })
    post: Types.ObjectId;

}

export const CommentaireSchema = SchemaFactory.createForClass(Commentaire);