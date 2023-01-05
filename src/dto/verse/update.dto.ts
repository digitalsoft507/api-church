import { IsString, IsDefined, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public verse: number; 

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chapterId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public bookId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public description: string;

    @IsOptional()
    @IsString()
    public title: string;

}