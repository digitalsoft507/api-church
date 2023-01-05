import { IsString, IsNumber } from 'class-validator';

class CreateUserDto {

    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    public username: string;

    @IsString()
    public name: string;

    @IsString()
    public lastName: string;

    @IsString()
    public profile: string;

}

export default CreateUserDto;