import { IsString, IsOptional } from 'class-validator';

export class FindDto {

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
    public cellPhone: string;
}