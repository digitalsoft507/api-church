import { IsString, IsDefined, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public firstName: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public lastName: string; 

    @IsDefined()
    @IsOptional()
    @IsString()
    public email: string; 

    @IsDefined()
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