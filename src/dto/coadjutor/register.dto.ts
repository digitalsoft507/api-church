import { Matches, IsDefined, IsString, IsEmail, Length, IsNotEmpty, IsOptional } from 'class-validator';
const nameRegex = /^[A-Za-zñÑÁáÉéÍíÓóÚúüÜ ]*$/;

export class RegisterDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(2, 40)
    @Matches(nameRegex, { message: "The firstName is incorrect." })
    public firstName: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(2, 40)
    @Matches(nameRegex, { message: "The firstName is incorrect." })
    public lastName: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Length(2, 40)
    public email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(6, 15)
    public password: string;

}