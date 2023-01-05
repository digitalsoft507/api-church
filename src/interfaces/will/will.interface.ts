export interface Will {
    _id?: number;
    name?: string;
    description: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}