import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema({timestamps: true})
export class Education {

  @Prop({ required: true })
  lieu : string

  @Prop({ required: true })
  anneeDebut : number

  @Prop({ required: true })
  anneeFin : string

  @Prop({ required: true })
  Diplome: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Référence à l'utilisateur qui a créé ce post
}

export const EducationSchema = SchemaFactory.createForClass(Education);
