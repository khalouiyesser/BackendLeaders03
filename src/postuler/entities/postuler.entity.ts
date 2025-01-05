import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";




@Schema({timestamps : true})
export class Postuler {


    @Prop()
    user: string;
    @Prop()
    post: string;

    @Prop()
    score: number;

    @Prop({default : false})
    interview : boolean

}
export const PostulerSchema = SchemaFactory.createForClass(Postuler);