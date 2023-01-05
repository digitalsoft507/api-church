import { Matches, IsDefined, IsNotEmpty, IsString, IsNumber, IsArray, Length } from 'class-validator';
const nameRegex = /^[A-Za-zñÑÁáÉéÍíÓóÚúüÜ ]*$/;

export class UpdateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Length(2, 40)
    @Matches(nameRegex, { message: "The name profile is incorrect." })
    public name: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsArray()
    public roles: [];

}