import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class FindByIdDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

}