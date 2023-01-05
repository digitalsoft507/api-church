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
    @IsString()
    public description: string;

}