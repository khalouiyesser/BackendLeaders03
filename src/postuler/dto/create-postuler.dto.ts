import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreatePostulerDto  {

    @IsNotEmpty()
    @IsString()
    user : string

    @IsNotEmpty()
    @IsString()
    post : string

    @IsOptional()
    score : number

}
