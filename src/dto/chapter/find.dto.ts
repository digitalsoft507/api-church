import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsNumber()
    @IsOptional()
    public chapter: number;

    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsNotEmpty()
    @IsNumber()
    public bookId: number;

    @IsString()
    @IsOptional()
    public description: string;
}