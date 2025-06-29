import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateChapterDto {

    @IsNumber()
    @IsNotEmpty()
    number: number;

    // description: string;

    @IsUUID()
    @IsNotEmpty()
    bookId: string;
}
