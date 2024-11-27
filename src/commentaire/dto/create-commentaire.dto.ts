// import {IsNotEmpty, IsObject, IsString} from "class-validator";
// import {Types} from "mongoose";
// import {Post} from "../../post/entities/post.entity";
//
//
// export class CreateCommentaireDto {
//
//
//     @IsNotEmpty()
//     @IsString()
//     user : Types.ObjectId
//
//
//     @IsNotEmpty()
//     @IsString()
//     Contenu : string;
//
//     @IsNotEmpty()
//     @IsObject()
//     post : Post;
//
//
// }

import {IsNotEmpty, IsString} from 'class-validator';

export class CreateCommentaireDto {
    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    @IsString() // Valide une chaîne de caractères
    Contenu: string;

    @IsNotEmpty()
    // @IsObject({ each: true })
    post: string; // Tableau d'objets Post
}
