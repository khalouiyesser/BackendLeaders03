import {IsNotEmpty, IsString} from "class-validator";
import {Types} from "mongoose";


export class CreateCommentaireDto {


    @IsNotEmpty()
    @IsString()
    user : Types.ObjectId


    @IsNotEmpty()
    @IsString()
    Contenu : string;

    @IsNotEmpty()
    @IsString()
    post : Types.ObjectId;


}
