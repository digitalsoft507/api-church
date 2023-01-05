import { IsDefined, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class DeleteDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

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

    @IsOptional()
    @IsNumber()
    public teachingId: number;

}