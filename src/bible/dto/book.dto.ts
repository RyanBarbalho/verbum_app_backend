import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    abbreviation: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['old', 'new'])
    testament: 'old' | 'new';

    @IsNumber()
    @IsNotEmpty()
    order: number;

    description: string;
}