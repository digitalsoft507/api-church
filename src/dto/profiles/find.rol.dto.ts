import { IsNumber, IsString, IsOptional } from 'class-validator';

export class RolFindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsString()
    @IsOptional()
    public name: string;

    @IsString()
    @IsOptional()
    public code: string;

}