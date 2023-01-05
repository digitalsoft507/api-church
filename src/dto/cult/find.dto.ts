import { IsString, IsNumber, IsOptional, IsNotEmpty, IsDefined } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsOptional()
    @IsString()
    public day: string;

    @IsOptional()
    @IsString()
    public turn: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public countryId: number;
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public provinceId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public churcheId: number;

    @IsOptional()
    @IsNumber()
    public teachingId: number;

    @IsOptional()
    @IsString()
    public status: string;

}