import { IsString, IsNumber, IsOptional } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public name: string;

    @IsString()
    @IsOptional()
    public description: string;
}