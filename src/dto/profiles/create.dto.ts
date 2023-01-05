import { Matches, IsDefined, IsNotEmpty, IsString, IsArray, Length } from 'class-validator';
const nameRegex = /^[A-Za-zñÑÁáÉéÍíÓóÚúüÜ ]*$/;
export class CreateDto {

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