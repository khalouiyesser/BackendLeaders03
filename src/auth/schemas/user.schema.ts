import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import {Commentaire} from "../../commentaire/entities/commentaire.entity";
import {Post} from "../../post/entities/post.entity";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  lastname: string;

  @Prop({ required: false, type: SchemaTypes.ObjectId })
  roleId: Types.ObjectId;

  @Prop({ required: false ,default:''})
  score: string;

  @Prop({ required: false ,default:''})
  phoneNumber: string;

  @Prop({ required: false ,default:'' })
  cv: string;

  @Prop({ type: [{ type: Object }] }) // Tableau d'objets complets
  posts: Post[];

  @Prop({ type:[SchemaTypes.ObjectId],ref : 'Education', required: false })
  educations: Types.ObjectId[];

  @Prop({ required: false ,default:''})
  domaine: string;

  @Prop({ required: false,default:'' })
  codePostal: string;

  @Prop({ required: false,default:'' })
  website: string;


  @Prop({ required: false,default:'' })
  photoUrl: string;

  @Prop({ required: false ,default:'candidat' })
  Role : string

  @Prop({ required: false})
  Bio : string

  @Prop({ type: [{ type: Object }] })
  savedPost: Post[];

  @Prop({ required: false})
  profileDescription : string


}

export const UserSchema = SchemaFactory.createForClass(User);
