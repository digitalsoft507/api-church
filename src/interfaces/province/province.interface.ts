export interface Province {
    _id?: number;
    name?: string;
    description: string;
    status?: string;
    countryId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}