import { IsString, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public name: string; 

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
    @IsString()
    public description: string;

}