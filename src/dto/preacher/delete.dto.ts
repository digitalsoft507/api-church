import { IsString, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public firstName: string; 

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public lastName: string; 

}