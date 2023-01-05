import { IsString, IsNumber, IsOptional, IsDefined, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public name: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public countryId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public provinceId: number;

    @IsString()
    @IsOptional()
    public description: string;
}