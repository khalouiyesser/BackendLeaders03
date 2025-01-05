import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";



@Schema({ timestamps: true })
export class Interview {
    @Prop()
    user: string;

    @Prop()
    post: string;

    @Prop()
    questions: string[];

    @Prop()
    postulation: string;

    @Prop()
    reponses: string[];

    // @Prop()
    // questionsUrl : string[]


}

export const InterviewSchema = SchemaFactory.createForClass(Interview);