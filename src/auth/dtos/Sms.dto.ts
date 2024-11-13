import { IsString } from "class-validator";

export class SmsDto {
    @IsString()
    phoneNumber: String
}