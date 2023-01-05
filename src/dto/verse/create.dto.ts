import { IsString, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsJSON, IsArray } from 'class-validator';
import { Json } from 'sequelize/types/utils';

export class CreateDto {

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

    @IsOptional()
    @IsArray()
    public descriptionJson: [];

}