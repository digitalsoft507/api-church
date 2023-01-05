import { IsString, IsNumber, IsOptional, IsDefined, IsNotEmpty } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public firstName: string;

    @IsString()
    @IsOptional()
    public lastName: string;

    @IsString()
    @IsOptional()
    public email: string;

    @IsString()
    @IsOptional()
    public phone: string;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chargeId: number;

    @IsString()
    @IsOptional()
    public description: string;
}