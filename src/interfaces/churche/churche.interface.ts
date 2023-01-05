export interface Churche {
    _id?: number;
    name?: string;
    description: string;
    status?: string;
    countryId?: number;
    provinceId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}