export interface Preacher {
    _id?: number;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    description: string;
    status: string;
    chargeId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: JSON;
    updatedBy?: JSON;
}