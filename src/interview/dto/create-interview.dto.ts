import {IsArray, IsNotEmpty, IsString} from "class-validator";


export class CreateInterviewDto {
    @IsNotEmpty()
    @IsString()
    user : string


    @IsNotEmpty()
    @IsString()
    post : string

    @IsNotEmpty()
    @IsArray()
    questions : string[]


}
