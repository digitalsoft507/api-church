import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsNumber()
    @IsOptional()
    public verse: number;

    @IsNotEmpty()
    @IsNumber()
    public chapterId: number;

    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsNotEmpty()
    @IsNumber()
    public bookId: number;

    @IsString()
    @IsOptional()
    public description: string;

    @IsString()
    @IsOptional()
    public search: string;
}