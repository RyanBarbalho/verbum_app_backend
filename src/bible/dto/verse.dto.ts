import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateVerseDto {

    @IsNumber()
    @IsNotEmpty()
    number: number;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsUUID()
    @IsNotEmpty()
    chapterId: string;
}