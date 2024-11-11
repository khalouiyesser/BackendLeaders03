import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
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

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Post', required: false })
  posts: Types.ObjectId[];

  @Prop({ type:[SchemaTypes.ObjectId],ref : 'Education', required: false })
  educations: Types.ObjectId[];

  @Prop({ required: false ,default:''})
  domaine: string;

  @Prop({ required: false,default:'' })
  codePostal: string;

  @Prop({ required: false,default:'' })
  website: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
