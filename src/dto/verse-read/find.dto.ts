import { IsNumber, IsOptional } from 'class-validator';

export class FindDto {

    @IsNumber()
    @IsOptional()
    public _id: number;

    @IsOptional()
    @IsNumber()
    public countryId: number;

    @IsOptional()
    @IsNumber()
    public provinceId: number;

    @IsOptional()
    @IsNumber()
    public churcheId: number;

    @IsOptional()
    @IsNumber()
    public chargeId: number;

    @IsNumber()
    @IsOptional()
    public cultId: number;

    @IsOptional()
    @IsNumber()
    public willId: number;

    @IsOptional()
    @IsNumber()
    public bookId: number;

    @IsOptional()
    @IsNumber()
    public chapterId: number;

    @IsOptional()
    @IsNumber()
    public verseId: number;

    @IsOptional()
    @IsNumber()
    public teachingId: number;

    @IsNumber()
    @IsOptional()
    public coadjutorId: number;

}