// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { Schema } from 'mongoose';
// import ObjectId = module
// import * as module from 'node:module';
// import { User } from '../../auth/schemas/user.schema';
//
//
// @Schema()
// export class Video {
//   @Prop({ required: true })
//   url: string;
//   @Prop({  type:ObjectId, ref:"Post", required: true })
//   postId: string;
// }
//
// export const VideoSchema = SchemaFactory.createForClass(Video);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema()
export class Video {
  @Prop({ required: true })
  url: string;

  @Prop({ type: Types.ObjectId, ref: "Post", required: true })
  postId: Types.ObjectId;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
