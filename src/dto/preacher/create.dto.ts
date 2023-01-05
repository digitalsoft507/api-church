import { IsString, IsDefined, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public firstName: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public lastName: string; 

    @IsOptional()
    @IsString()
    public email: string; 

    @IsOptional()
    @IsString()
    public phone: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chargeId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public description: string;

}