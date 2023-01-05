import { IsString, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chapter: number;
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public bookId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public description: string;

}