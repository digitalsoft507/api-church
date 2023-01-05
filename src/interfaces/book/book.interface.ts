export interface Book {
    _id?: number;
    name?: string;
    description: string;
    status?: string;
    willId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}