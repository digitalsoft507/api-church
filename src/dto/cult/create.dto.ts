import { IsDefined, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public day: string;

    @IsDefined()
    @IsNotEmpty()
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

    @IsDefined()
    @IsOptional()
    @IsNumber()
    public teachingId: number;

}