import { IsNumber, IsNotEmpty, IsDefined } from 'class-validator';

export class FindByIdDto {
    
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

}