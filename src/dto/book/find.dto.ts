import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public name: string;

    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsString()
    @IsOptional()
    public description: string;
    
}