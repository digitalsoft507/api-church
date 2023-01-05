import { IsString, IsNumber, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Length(2, 50)
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    public password: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    public passwordConfirmation: string;

}