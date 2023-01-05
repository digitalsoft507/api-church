import { IsNotEmpty, IsString, IsDefined, IsEmail, IsNumber } from 'class-validator';

export class DeleteDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;
    
}