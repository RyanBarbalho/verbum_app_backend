import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateChapterDto {

    @IsNumber()
    @IsNotEmpty()
    number: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUUID()
    @IsNotEmpty()
    bookId: string;
}
