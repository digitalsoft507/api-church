import { Matches, IsDefined, IsString, IsNumber, IsEmail, Length, IsNotEmpty, IsOptional } from 'class-validator';
const nameRegex = /^[A-Za-zñÑÁáÉéÍíÓóÚúüÜ ]*$/;

export class UpdateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Length(2, 40)
    public email: string;

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
    @Matches(nameRegex, { message: "The lastName is incorrect." })
    public lastName: string;

    @IsOptional()
    @IsString()
    @Length(6, 15)
    public cellPhone: string;
}