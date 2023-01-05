import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public name: string;

    @IsNumber()
    @IsNotEmpty()
    public countryId: number;

    @IsString()
    @IsOptional()
    public description: string;
}