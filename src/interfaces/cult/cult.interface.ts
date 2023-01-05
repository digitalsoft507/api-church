export interface Cult {
    _id?: number;
    day?: string;
    turn?: string;
    countryId?: number;
    provinceId?: number;
    churcheId?: number;
    teachingId: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}