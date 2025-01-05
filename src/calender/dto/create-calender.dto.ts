import {IsNotEmpty, IsString} from "class-validator";

export class CreateCalenderDto {
    @IsNotEmpty()
    user: string;

    @IsNotEmpty()
    @IsString() // Valide une chaîne de caractères
    heure: string;
    @IsNotEmpty()
    @IsString() // Valide une chaîne de caractères
    date: string;

    @IsNotEmpty()
    description: string; // Tableau d'objets Post

}
