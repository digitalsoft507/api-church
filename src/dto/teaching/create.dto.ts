import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class CreateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public name: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public description: string;

}