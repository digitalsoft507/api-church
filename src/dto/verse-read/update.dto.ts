import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDto {

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public _id: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public countryId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public provinceId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public churcheId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chargeId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public preacherId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public willId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public bookId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public chapterId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public verseId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public teachingId: number;

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    public coadjutorId: number;

}