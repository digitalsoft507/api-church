import { IsString, IsOptional } from 'class-validator';

export class FindDto {

    @IsString()
    @IsOptional()
    public name: string;

    @IsString()
    @IsOptional()
    public lastName: string;

    @IsString()
    @IsOptional()
    public email: string;
}