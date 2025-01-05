import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


@Schema()
export class Calender {
    @Prop({ required: false })  // Référence à la collection User
    user: string;

    @Prop({ required: false })
    heure: string;

    @Prop({ required: false })
    date: string;

    @Prop({ required: false}) // Référence à la collection Post
    description: string;
}
export const calenderSchema = SchemaFactory.createForClass(Calender);