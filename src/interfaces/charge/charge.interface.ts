export interface Charge {
    _id?: number;
    name?: string;
    description: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}