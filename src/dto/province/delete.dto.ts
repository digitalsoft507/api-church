import { IsString, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public name: string; 

}